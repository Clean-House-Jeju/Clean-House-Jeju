import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { fetchDataGoKrCsv } from "../src/fetch-csv.js";
import { SiteSchema, SnapshotSchema } from "../src/schema.js";

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), "../../data");

// 실 API 통합 테스트 (constitution 원칙 III) — 건수 하한은 원본 축소 감지용
describe("live sources", () => {
	it("제주시 클린하우스 ≥ 1,300행", { timeout: 60_000 }, async () => {
		const { rows } = await fetchDataGoKrCsv("15110514");
		expect(rows.length).toBeGreaterThanOrEqual(1300);
		expect(rows[0]).toHaveProperty("위도 좌표");
	});

	it("서귀포시 클린하우스 ≥ 350행", { timeout: 60_000 }, async () => {
		const { rows } = await fetchDataGoKrCsv("15056472");
		expect(rows.length).toBeGreaterThanOrEqual(350);
	});

	it("재활용도움센터 ≥ 150행", { timeout: 60_000 }, async () => {
		const { rows } = await fetchDataGoKrCsv("15045364");
		expect(rows.length).toBeGreaterThanOrEqual(150);
	});
});

describe("산출물 계약 (data/*.json)", () => {
	it("sites.json이 스키마를 만족하고 1,500개소 이상", () => {
		const sites = JSON.parse(readFileSync(join(DATA_DIR, "sites.json"), "utf-8"));
		z.array(SiteSchema).parse(sites);
		expect(sites.length).toBeGreaterThanOrEqual(1500);
		expect(sites.filter((s: { type: string }) => s.type === "recycle").length).toBeGreaterThanOrEqual(70);
	});

	it("snapshot.json이 스키마를 만족하고 전 소스 ok", () => {
		const snap = SnapshotSchema.parse(JSON.parse(readFileSync(join(DATA_DIR, "snapshot.json"), "utf-8")));
		expect(snap.sources.every((s) => s.status === "ok")).toBe(true);
	});

	it("rules.json이 두 행정시 규칙을 갖는다", () => {
		const rules = JSON.parse(readFileSync(join(DATA_DIR, "rules.json"), "utf-8"));
		const districts = rules.rules.map((r: { district: string }) => r.district);
		expect(districts).toContain("jeju");
		expect(districts).toContain("seogwipo");
	});
});
