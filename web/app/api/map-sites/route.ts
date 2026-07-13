import { NextResponse } from "next/server";
import { getDataAsOf, getSites } from "@/lib/data";
import type { MapSite } from "@/lib/types";

// 지도용 경량 투영 (contracts §2) — 메모리 캐시 기반이라 동적이어도 저렴
export async function GET() {
	const sites: MapSite[] = getSites().map((s) => ({
		id: s.id,
		name: s.name,
		lat: s.lat,
		lng: s.lng,
		type: s.type,
		district: s.district,
		emd: s.emd,
		address: s.address,
		...(s.openTime ? { openTime: s.openTime } : {}),
		...(s.closeTime ? { closeTime: s.closeTime } : {}),
		...(s.open24h ? { open24h: s.open24h } : {}),
	}));

	return NextResponse.json(
		{ asOf: getDataAsOf(), sites },
		{
			headers: {
				"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
			},
		},
	);
}
