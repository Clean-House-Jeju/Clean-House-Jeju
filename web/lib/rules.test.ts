import { describe, expect, it } from "vitest";
import { todayInSeoul } from "./rules";

describe("todayInSeoul — 서버 TZ 무관 요일 계산", () => {
	it("UTC 월요일 23시 = KST 화요일", () => {
		// 2026-07-13(월) 23:00 UTC → KST 2026-07-14(화) 08:00
		expect(todayInSeoul(new Date("2026-07-13T23:00:00Z")).day).toBe("tue");
	});
	it("UTC 일요일 14:59 = KST 일요일 23:59", () => {
		expect(todayInSeoul(new Date("2026-07-12T14:59:00Z")).day).toBe("sun");
	});
	it("UTC 일요일 15:00 = KST 월요일 00:00", () => {
		expect(todayInSeoul(new Date("2026-07-12T15:00:00Z")).day).toBe("mon");
	});
});
