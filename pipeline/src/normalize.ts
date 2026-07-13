import { createHash } from "node:crypto";
import { JEJU_BBOX, type RawSite, type Reject, type Site, SiteSchema } from "./schema.js";
import { normalizeAddress } from "./geocode.js";

/** 안정 식별자 — 주소+명칭 해시. 수집 회차가 바뀌어도 동일 개소면 동일 id (상세 URL 계약) */
export function siteId(type: "clean" | "recycle", address: string, name: string): string {
	const h = createHash("sha1").update(`${type}|${normalizeAddress(address)}|${name.trim()}`).digest("hex");
	return `${type}-${h.slice(0, 10)}`;
}

const EARTH_M = 6371000;
function distanceM(aLat: number, aLng: number, bLat: number, bLng: number): number {
	const dLat = ((bLat - aLat) * Math.PI) / 180;
	const dLng = ((bLng - aLng) * Math.PI) / 180;
	const s =
		Math.sin(dLat / 2) ** 2 +
		Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
	return 2 * EARTH_M * Math.asin(Math.sqrt(s));
}

export interface NormalizeOutput {
	sites: Site[];
	rejects: Reject[];
}

/** RawSite(좌표 해석 완료분) → 검증·중복 제거된 Site[] */
export function normalize(raws: RawSite[]): NormalizeOutput {
	const sites: Site[] = [];
	const rejects: Reject[] = [];

	for (const raw of raws) {
		if (!raw.address) {
			rejects.push({ source: raw.source, reason: "주소 없음", row: raw.raw });
			continue;
		}
		if (raw.lat === undefined || raw.lng === undefined) {
			rejects.push({ source: raw.source, reason: "좌표 미해석 (geocode-pending)", row: raw.raw });
			continue;
		}
		// 위·경도 뒤바뀜 보정 (원본·레거시 데이터에 실존하는 오류 유형)
		if (
			raw.lat >= JEJU_BBOX.lngMin && raw.lat <= JEJU_BBOX.lngMax &&
			raw.lng >= JEJU_BBOX.latMin && raw.lng <= JEJU_BBOX.latMax
		) {
			[raw.lat, raw.lng] = [raw.lng, raw.lat];
		}
		if (
			raw.lat < JEJU_BBOX.latMin || raw.lat > JEJU_BBOX.latMax ||
			raw.lng < JEJU_BBOX.lngMin || raw.lng > JEJU_BBOX.lngMax
		) {
			rejects.push({ source: raw.source, reason: `제주 bbox 밖 좌표 (${raw.lat}, ${raw.lng})`, row: raw.raw });
			continue;
		}

		const candidate: Site = {
			id: siteId(raw.type, raw.address, raw.name),
			type: raw.type,
			name: raw.name,
			address: raw.address,
			lat: raw.lat,
			lng: raw.lng,
			district: raw.district,
			emd: raw.emd,
			...(raw.openTime ? { openTime: raw.openTime } : {}),
			...(raw.closeTime ? { closeTime: raw.closeTime } : {}),
			...(raw.bins ? { bins: raw.bins } : {}),
			...(raw.cctv !== undefined ? { cctv: raw.cctv } : {}),
			...(raw.services ? { services: raw.services } : {}),
			source: raw.source,
		};

		const parsed = SiteSchema.safeParse(candidate);
		if (!parsed.success) {
			rejects.push({ source: raw.source, reason: `스키마 위반: ${parsed.error.issues[0]?.message}`, row: raw.raw });
			continue;
		}
		sites.push(parsed.data);
	}

	// 동일 유형 30m 이내 중복 — 뒤 소스(입력 순서 기준 최신) 우선이 아닌, 정보량 많은 쪽 유지
	const deduped: Site[] = [];
	for (const site of sites) {
		const dupIdx = deduped.findIndex(
			(s) => s.type === site.type && distanceM(s.lat, s.lng, site.lat, site.lng) < 30,
		);
		if (dupIdx === -1) {
			deduped.push(site);
			continue;
		}
		const kept = deduped[dupIdx];
		const richness = (s: Site) => (s.bins ? 1 : 0) + (s.services ? 1 : 0) + (s.openTime ? 1 : 0);
		if (richness(site) > richness(kept)) deduped[dupIdx] = site;
		rejects.push({
			source: site.source,
			reason: `중복 개소 (30m 이내, 유지: ${deduped[dupIdx].id})`,
			row: { id: site.id, address: site.address },
		});
	}

	return { sites: deduped, rejects };
}
