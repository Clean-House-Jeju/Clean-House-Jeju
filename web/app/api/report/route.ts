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
	if (rateLimited(ip)) {
		return NextResponse.json({ error: "잠시 후 다시 시도해 주세요" }, { status: 429 });
	}

	const site = body.siteId ? getSiteById(body.siteId) : undefined;
	const lines = [
		`분류: ${body.category}`,
		site ? `개소: ${site.name} (${site.id})\n주소: ${site.address}` : body.siteId ? `개소 ID: ${body.siteId}` : "개소: (미지정)",
		body.contact ? `연락처: ${body.contact}` : null,
		"",
		body.message.trim(),
	].filter((l) => l !== null);

	const apiKey = process.env.RESEND_API_KEY;
	const to = process.env.REPORT_TO_EMAIL;
	if (apiKey && to) {
		const res = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
			body: JSON.stringify({
				from: process.env.REPORT_FROM_EMAIL ?? "clean-jeju <onboarding@resend.dev>",
				to: [to],
				subject: `[클린제주 제보] ${body.category}${site ? ` — ${site.name}` : ""}`,
				text: lines.join("\n"),
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
