import { describe, expect, it } from "vitest";
import { formatHours, isOpen } from "./status";

// KST 기준 시각 생성 (UTC+9)
const kst = (h: number, m = 0) => new Date(Date.UTC(2026, 6, 13, h - 9, m));

describe("isOpen — 자정 넘김(15:00~04:00)", () => {
	const site = { openTime: "15:00", closeTime: "04:00" };

	it("새벽 02:00 → 운영중", () => {
		expect(isOpen(site, kst(2))).toBe(true);
	});
	it("오전 10:00 → 마감", () => {
		expect(isOpen(site, kst(10))).toBe(false);
	});
	it("15:00 정각 → 운영중", () => {
		expect(isOpen(site, kst(15))).toBe(true);
	});
	it("04:00 정각 → 마감", () => {
		expect(isOpen(site, kst(4))).toBe(false);
	});
});

describe("isOpen — 일반 시간대(06:00~22:00)", () => {
	const site = { openTime: "06:00", closeTime: "22:00" };

	it("오후 21:59 → 운영중", () => {
		expect(isOpen(site, kst(21, 59))).toBe(true);
	});
	it("오후 22:00 → 마감", () => {
		expect(isOpen(site, kst(22))).toBe(false);
	});
});

describe("isOpen — 정보 없음/24시간", () => {
	it("운영시간 없으면 undefined", () => {
		expect(isOpen({}, kst(12))).toBeUndefined();
	});
	it("open24h → 항상 운영중", () => {
		expect(isOpen({ open24h: true }, kst(3))).toBe(true);
	});
});

describe("formatHours", () => {
	it("자정 넘김은 '익일' 표기", () => {
		expect(formatHours({ openTime: "15:00", closeTime: "04:00" })).toBe("15:00~익일 04:00");
	});
	it("일반 시간대", () => {
		expect(formatHours({ openTime: "06:00", closeTime: "22:00" })).toBe("06:00~22:00");
	});
});
