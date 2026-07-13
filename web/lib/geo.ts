/** 거리·경계 유틸 — 레거시 GetDistanceFromLatLonInKm/checkInJuju 이관 (research R5) */

// 추자면·마라도·가파도 포함 (파이프라인 schema.ts와 동일 값 유지)
export const JEJU_BBOX = {
	latMin: 33.05,
	latMax: 34.05,
	lngMin: 125.9,
	lngMax: 127.1,
} as const;

// 레거시 기본 중심 좌표 계승
export const DEFAULT_CENTER = { lat: 33.450701, lng: 126.570667 } as const;

export function isInJeju(lat: number, lng: number): boolean {
	return (
		lat >= JEJU_BBOX.latMin && lat <= JEJU_BBOX.latMax &&
		lng >= JEJU_BBOX.lngMin && lng <= JEJU_BBOX.lngMax
	);
}

/** Haversine (km) */
export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
	const R = 6371;
	const dLat = ((bLat - aLat) * Math.PI) / 180;
	const dLng = ((bLng - aLng) * Math.PI) / 180;
	const s =
		Math.sin(dLat / 2) ** 2 +
		Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
	return 2 * R * Math.asin(Math.sqrt(s));
}

export function formatDistance(km: number): string {
	return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`;
}
