import type { Snapshot } from "./schema.js";

/** 실패 시에만 이메일 (운영 방침: 일상=이메일, 긴급 채널 미사용) */
export async function sendFailureEmail(subject: string, body: string): Promise<void> {
	const apiKey = process.env.RESEND_API_KEY;
	const to = process.env.REPORT_TO_EMAIL;
	if (!apiKey || !to) {
		console.error(`[report] 이메일 미설정 — 콘솔로 대체:\n${subject}\n${body}`);
		return;
	}
	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
		body: JSON.stringify({
			from: process.env.REPORT_FROM_EMAIL ?? "clean-jeju <onboarding@resend.dev>",
			to: [to],
			subject,
			text: body,
		}),
	});
	if (!res.ok) console.error(`[report] Resend 발송 실패: HTTP ${res.status} ${await res.text()}`);
}

export function summarize(snapshot: Snapshot): string {
	const lines = snapshot.sources.map(
		(s) =>
			`- ${s.id} [${s.status}] fetched=${s.fetchedRows} accepted=${s.acceptedRows} rejected=${s.rejectedRows}${s.dataDate ? ` (기준일 ${s.dataDate})` : ""}`,
	);
	return `수집 시각: ${snapshot.collectedAt}\n총 반영: ${snapshot.totalSites}개소\n${lines.join("\n")}`;
}
