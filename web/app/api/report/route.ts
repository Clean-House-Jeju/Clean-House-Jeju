import { type NextRequest, NextResponse } from "next/server";
import { getSiteById } from "@/lib/data";

// 제보 폼 수신 (contracts §2, FR-019) — 개인 이메일 mailto의 대체

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
	const now = Date.now();
	const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
	if (arr.length >= MAX_PER_WINDOW) return true;
	arr.push(now);
	hits.set(ip, arr);
	return false;
}

const CATEGORIES = new Set(["wrong-info", "closed", "suggestion"]);

// 메일 표기 — 폼(ReportForm)과 동일한 라벨
const CATEGORY_LABEL: Record<string, string> = {
	"wrong-info": "정보가 달라요",
	closed: "없어졌어요",
	suggestion: "제안·기타",
};
const CATEGORY_COLOR: Record<string, string> = {
	"wrong-info": "#ff9c31",
	closed: "#e2574c",
	suggestion: "#4f56c9",
};

function escapeHtml(s: string): string {
	return s
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}

export async function POST(req: NextRequest) {
	const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

	let body: {
		siteId?: string;
		category?: string;
		message?: string;
		contact?: string;
		website?: string; // honeypot
	};
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "invalid body" }, { status: 400 });
	}

	// honeypot: 봇이 채우면 조용히 폐기
	if (body.website) return NextResponse.json({ ok: true });

	if (!body.category || !CATEGORIES.has(body.category) || !body.message?.trim()) {
		return NextResponse.json({ error: "category와 message는 필수입니다" }, { status: 400 });
	}
	if (body.message.length > 2000) {
		return NextResponse.json({ error: "message가 너무 깁니다" }, { status: 400 });
	}
	// dev/E2E 반복 실행이 카운트를 소진하지 않도록 프로덕션에서만 제한 (실배포 검증은 T033)
	if (process.env.NODE_ENV === "production" && rateLimited(ip)) {
		return NextResponse.json({ error: "잠시 후 다시 시도해 주세요" }, { status: 429 });
	}

	const site = body.siteId ? getSiteById(body.siteId) : undefined;
	const label = CATEGORY_LABEL[body.category] ?? body.category;
	const message = body.message.trim();
	const receivedAt = new Date().toLocaleString("ko-KR", {
		timeZone: "Asia/Seoul",
		dateStyle: "long",
		timeStyle: "short",
	});

	const lines = [
		`분류: ${label}`,
		site ? `개소: ${site.name} (${site.id})\n주소: ${site.address}` : body.siteId ? `개소 ID: ${body.siteId}` : "개소: (미지정)",
		body.contact ? `연락처: ${body.contact}` : null,
		"",
		message,
	].filter((l) => l !== null);

	const apiKey = process.env.RESEND_API_KEY;
	const to = process.env.REPORT_TO_EMAIL;
	if (apiKey && to) {
		const badge = CATEGORY_COLOR[body.category] ?? "#4f56c9";
		const siteRows = site
			? [
					["개소", `${escapeHtml(site.name)} <span style="color:#8b939c">· ${site.type === "clean" ? "클린하우스" : "재활용도움센터"}</span>`],
					["주소", escapeHtml(site.address)],
					["지도", `<a href="https://map.kakao.com/link/map/${encodeURIComponent(site.name)},${site.lat},${site.lng}" style="color:#12a37a;font-weight:700">카카오맵에서 위치 보기 →</a>`],
				]
			: body.siteId
				? [["개소 ID", escapeHtml(body.siteId)]]
				: [];
		if (body.contact) siteRows.push(["연락처", escapeHtml(body.contact)]);
		const infoTable = siteRows.length
			? `<table cellpadding="0" cellspacing="0" style="width:100%;margin:18px 0 0;border-collapse:collapse">
					${siteRows
						.map(
							([k, v]) => `<tr>
						<td style="padding:7px 14px 7px 0;font-size:12.5px;font-weight:700;color:#8b939c;white-space:nowrap;vertical-align:top">${k}</td>
						<td style="padding:7px 0;font-size:14px;color:#1c2733">${v}</td>
					</tr>`,
						)
						.join("")}
				</table>`
			: "";

		const html = `<div style="margin:0;padding:28px 16px;background:#fafcfb;font-family:'Apple SD Gothic Neo','Pretendard',-apple-system,'Segoe UI',sans-serif">
	<div style="max-width:560px;margin:0 auto">
		<div style="padding:0 4px 14px;font-size:16px;font-weight:800;color:#0d7d5e">
			♻️ 클린 제주 <span style="font-weight:600;color:#5c6b7a">— 새 제보가 도착했어요</span>
		</div>
		<div style="background:#ffffff;border:1px solid #e4e9e7;border-radius:18px;padding:24px;box-shadow:0 4px 14px rgba(13,60,48,0.06)">
			<span style="display:inline-block;padding:5px 13px;border-radius:999px;background:${badge};color:#ffffff;font-size:12.5px;font-weight:800">${escapeHtml(label)}</span>
			${site ? `<div style="margin-top:14px;font-size:19px;font-weight:800;color:#1c2733">${escapeHtml(site.name)}</div>` : ""}
			${infoTable}
			<div style="margin-top:18px;padding:16px 18px;border-radius:14px;background:#f3f8f6;border-left:4px solid #12a37a;font-size:15px;line-height:1.7;color:#1c2733;white-space:pre-wrap">${escapeHtml(message)}</div>
		</div>
		<div style="padding:16px 4px 0;font-size:12px;line-height:1.6;color:#8b939c">
			${receivedAt} 수신 · <a href="https://jejucleanhouse.com" style="color:#12a37a">jejucleanhouse.com</a> 제보 폼에서 자동 발송${body.contact?.includes("@") ? " · 이 메일에 답장하면 제보자에게 회신됩니다" : ""}
		</div>
	</div>
</div>`;

		const res = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
			body: JSON.stringify({
				from: process.env.REPORT_FROM_EMAIL ?? "clean-jeju <onboarding@resend.dev>",
				to: [to],
				// 연락처가 이메일이면 그대로 답장 가능하게
				...(body.contact?.includes("@") ? { reply_to: body.contact.trim() } : {}),
				subject: `[클린제주 제보] ${label}${site ? ` — ${site.name}` : ""}`,
				text: lines.join("\n"),
				html,
			}),
		});
		if (!res.ok) {
			console.error(`[report] Resend 실패: ${res.status} ${await res.text()}`);
			return NextResponse.json({ error: "발송 실패 — 잠시 후 다시 시도해 주세요" }, { status: 502 });
		}
	} else {
		// 메일 미설정 환경(로컬)에서는 로그로 수신 확인
		console.log(`[report] (메일 미설정) ${lines.join(" | ")}`);
	}

	return NextResponse.json({ ok: true });
}
