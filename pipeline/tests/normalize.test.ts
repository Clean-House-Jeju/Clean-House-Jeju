import { describe, expect, it } from "vitest";
import { normalize, siteId } from "../src/normalize.js";
import type { RawSite } from "../src/schema.js";

const base: RawSite = {
	type: "clean",
	name: "테스트",
	address: "제주특별자치도 제주시 한림읍 한림리 1328-62",
	lat: 33.4161,
	lng: 126.2623,
	district: "jeju",
	emd: "한림읍",
	source: "test",
	raw: {},
};

describe("siteId", () => {
	it("주소 표기(시도 접두어) 차이에도 동일 id", () => {
		expect(siteId("clean", "제주특별자치도 제주시 한림읍 한림남길 12", "A")).toBe(
			siteId("clean", "제주시 한림읍 한림남길 12", "A"),
		);
	});
});

describe("normalize", () => {
	it("위·경도 뒤바뀐 좌표를 보정한다", () => {
		const { sites, rejects } = normalize([{ ...base, lat: 126.66, lng: 33.28 }]);
		expect(rejects).toHaveLength(0);
		expect(sites[0].lat).toBeCloseTo(33.28);
		expect(sites[0].lng).toBeCloseTo(126.66);
	});

	it("추자면·마라도 좌표를 수용한다", () => {
		const { sites } = normalize([
			{ ...base, address: "제주시 추자면 대서리 19-2", lat: 33.9638, lng: 126.2963 },
			{ ...base, address: "서귀포시 대정읍 마라로 101", lat: 33.117, lng: 126.267, district: "seogwipo" },
		]);
		expect(sites).toHaveLength(2);
	});

	it("제주 밖 좌표는 격리한다", () => {
		const { sites, rejects } = normalize([{ ...base, lat: 37.5665, lng: 126.978 }]);
		expect(sites).toHaveLength(0);
		expect(rejects[0].reason).toContain("bbox");
	});

	it("30m 이내 동일 유형은 정보량 많은 쪽을 유지한다", () => {
		const poor: RawSite = { ...base, address: "다른주소 1" };
		const rich: RawSite = { ...base, address: "다른주소 2", lat: base.lat + 0.0001, bins: { general: 2 } };
		const { sites } = normalize([poor, rich]);
		expect(sites).toHaveLength(1);
		expect(sites[0].bins).toBeDefined();
	});

	it("좌표 미해석 행은 geocode-pending으로 격리한다", () => {
		const { rejects } = normalize([{ ...base, lat: undefined, lng: undefined }]);
		expect(rejects[0].reason).toContain("geocode-pending");
	});
});
