import { readFileSync, writeFileSync, existsSync } from "node:fs";

export interface GeocodeEntry {
	lat: number;
	lng: number;
	provider: "kakao" | "legacy-2021";
}

export type Geocache = Record<string, GeocodeEntry>;

/** 주소 정규화 — 시도 접두어·공백 차이를 흡수해 캐시 키로 사용 */
export function normalizeAddress(addr: string): string {
	return addr
		.replace(/^제주특별자치도\s*/, "")
		.replace(/\s+/g, " ")
		.replace(/\(.*?\)\s*$/, "") // 말미 괄호(지목 등) 제거
		.trim();
}

export function loadGeocache(path: string): Geocache {
	if (!existsSync(path)) return {};
	return JSON.parse(readFileSync(path, "utf-8"));
}

export function saveGeocache(path: string, cache: Geocache): void {
	const sorted = Object.fromEntries(Object.entries(cache).sort(([a], [b]) => a.localeCompare(b)));
	writeFileSync(path, `${JSON.stringify(sorted, null, "\t")}\n`);
}

/** Kakao Local 주소 검색 — KAKAO_REST_KEY 없으면 null (캐시 미스는 격리 처리) */
export async function geocodeKakao(address: string, restKey: string): Promise<GeocodeEntry | null> {
	const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`;
	const res = await fetch(url, { headers: { Authorization: `KakaoAK ${restKey}` } });
	if (res.status === 429) {
		await new Promise((r) => setTimeout(r, 1000));
		return geocodeKakao(address, restKey);
	}
	if (!res.ok) throw new Error(`kakao geocode HTTP ${res.status}`);
	const body = (await res.json()) as { documents: { x: string; y: string }[] };
	const doc = body.documents[0];
	if (!doc) return null;
	return { lat: Number(doc.y), lng: Number(doc.x), provider: "kakao" };
}

export interface GeocodeResult {
	resolved: Map<string, GeocodeEntry>;
	misses: string[];
}

/** 캐시 우선, 미스는 Kakao(키 있을 때만). 새로 해석된 값은 캐시에 반영 */
export async function geocodeAll(
	addresses: string[],
	cache: Geocache,
	restKey: string | undefined,
): Promise<GeocodeResult> {
	const resolved = new Map<string, GeocodeEntry>();
	const misses: string[] = [];

	for (const addr of addresses) {
		const key = normalizeAddress(addr);
		// legacy-2021 시드는 키가 생기면 정식 지오코딩으로 승격
		const cached = cache[key];
		if (cached && !(restKey && cached.provider === "legacy-2021")) {
			resolved.set(addr, cached);
			continue;
		}
		if (!restKey) {
			misses.push(addr);
			continue;
		}
		const entry = await geocodeKakao(key, restKey);
		if (entry) {
			cache[key] = entry;
			resolved.set(addr, entry);
		} else {
			misses.push(addr);
		}
		await new Promise((r) => setTimeout(r, 60)); // rate 완충
	}
	return { resolved, misses };
}
