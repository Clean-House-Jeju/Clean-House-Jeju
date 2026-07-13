/**
 * 2021 레거시 스냅샷(Clean-House-Data cleandata.json)의 좌표를
 * 지오코딩 시드 캐시로 변환한다. 1회성 부트스트랩 — KAKAO_REST_KEY가
 * 설정되면 legacy-2021 항목은 정식 지오코딩으로 자동 승격된다.
 *
 * 사용: tsx scripts/seed-geocache.ts <cleandata.json 경로>
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { type Geocache, loadGeocache, normalizeAddress, saveGeocache } from "../src/geocode.js";

const legacyPath = process.argv[2];
if (!legacyPath) {
	console.error("usage: tsx scripts/seed-geocache.ts <cleandata.json>");
	process.exit(1);
}

const GEOCACHE_PATH = join(dirname(fileURLToPath(import.meta.url)), "../../data/geocache.json");

interface LegacyRow {
	address: string;
	location: string;
	latitude: number;
	longitude: number;
}

const rows: LegacyRow[] = JSON.parse(readFileSync(legacyPath, "utf-8"));
const cache: Geocache = loadGeocache(GEOCACHE_PATH);
let added = 0;

for (const row of rows) {
	if (!row.address || !Number.isFinite(row.latitude) || !Number.isFinite(row.longitude)) continue;
	const key = normalizeAddress(row.address);
	if (cache[key]) continue;
	cache[key] = { lat: row.latitude, lng: row.longitude, provider: "legacy-2021" };
	added++;
}

saveGeocache(GEOCACHE_PATH, cache);
console.log(`seeded ${added} entries → ${GEOCACHE_PATH} (total ${Object.keys(cache).length})`);
