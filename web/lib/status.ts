/** 운영 상태 계산 — 자정 넘김(15:00~04:00) 처리 필수 (spec Edge Case) */

function toMinutes(hhmm: string): number {
	const [h, m] = hhmm.split(":").map(Number);
	return h * 60 + m;
}

/** Asia/Seoul 현재 시각(분) — 서버 TZ와 무관하게 동작 */
export function nowMinutesInSeoul(now: Date = new Date()): number {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Asia/Seoul",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).formatToParts(now);
	const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
	const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
	return (h % 24) * 60 + m;
}

/**
 * 개소별 운영시간이 없으면 관할 시 규칙(cleanHouseHours)으로 보강.
 * 레거시는 15:00~04:00을 전역 하드코딩했지만, 여기선 rules 데이터로 주입한다.
 */
export function withRuleHours<
	T extends { openTime?: string; closeTime?: string; open24h?: boolean; type?: string; district?: string },
>(site: T, rules?: { district: string; cleanHouseHours: { start: string; end: string } | null }[]): T {
	if (site.open24h || (site.openTime && site.closeTime)) return site;
	if (site.type === "clean") {
		const hours = rules?.find((r) => r.district === site.district)?.cleanHouseHours;
		if (hours) return { ...site, openTime: hours.start, closeTime: hours.end };
	}
	return site;
}

export function isOpen(
	site: { openTime?: string; closeTime?: string; open24h?: boolean },
	now: Date = new Date(),
): boolean | undefined {
	if (site.open24h) return true;
	if (!site.openTime || !site.closeTime) return undefined; // 운영시간 정보 없음
	const t = nowMinutesInSeoul(now);
	const open = toMinutes(site.openTime);
	const close = toMinutes(site.closeTime);
	if (close === open) return true;
	// 자정 넘김: 15:00~04:00 → t ≥ open || t < close
	if (close < open) return t >= open || t < close;
	return t >= open && t < close;
}

export function formatHours(site: { openTime?: string; closeTime?: string; open24h?: boolean }): string {
	if (site.open24h) return "24시간";
	if (!site.openTime || !site.closeTime) return "운영시간 정보 없음";
	const crossesMidnight = toMinutes(site.closeTime) < toMinutes(site.openTime);
	return `${site.openTime}~${crossesMidnight ? "익일 " : ""}${site.closeTime}`;
}
