import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { RulesFile, Site, Snapshot } from "./types";

// 파이프라인 산출물 위치 — 배포 환경은 DATA_DIR로 주입 (contracts §1)
const DATA_DIR = process.env.DATA_DIR ?? join(process.cwd(), "..", "data");

interface Cache {
	sites: Site[] | null;
	rules: RulesFile | null;
	snapshot: Snapshot | null;
}

const cache: Cache = { sites: null, rules: null, snapshot: null };

/** /api/revalidate가 호출 — 다음 조회부터 파일 재독 */
export function invalidateDataCache(): void {
	cache.sites = null;
	cache.rules = null;
	cache.snapshot = null;
}

function readJson<T>(file: string): T {
	return JSON.parse(readFileSync(join(DATA_DIR, file), "utf-8")) as T;
}

export function getSites(): Site[] {
	cache.sites ??= readJson<Site[]>("sites.json");
	return cache.sites;
}

export function getRules(): RulesFile {
	cache.rules ??= readJson<RulesFile>("rules.json");
	return cache.rules;
}

export function getSnapshot(): Snapshot {
	cache.snapshot ??= readJson<Snapshot>("snapshot.json");
	return cache.snapshot;
}

export function getSiteById(id: string): Site | undefined {
	return getSites().find((s) => s.id === id);
}

/** 데이터 기준일 표시용 (FR-005) — 소스 중 가장 최신 dataDate, 없으면 수집 시각 */
export function getDataAsOf(): string {
	const snap = getSnapshot();
	const dates = snap.sources.map((s) => s.dataDate).filter(Boolean) as string[];
	return dates.sort().at(-1) ?? snap.collectedAt.slice(0, 10);
}
