"use client";

import { useEffect, useState } from "react";
import { isInJeju } from "@/lib/geo";

export type GeoState =
	| { status: "loading" }
	| { status: "granted"; lat: number; lng: number; inJeju: boolean }
	| { status: "denied" }
	| { status: "unavailable" };

/**
 * 위치 조회 — 거부·타임아웃·미지원 모두 5초 내 확정 상태로 끝난다.
 * (레거시 무한 로딩 버그의 재발 방지가 이 훅의 존재 이유 — FR-007)
 */
export function useGeolocation(timeoutMs = 5000): GeoState {
	const [state, setState] = useState<GeoState>({ status: "loading" });

	useEffect(() => {
		if (!("geolocation" in navigator)) {
			setState({ status: "unavailable" });
			return;
		}
		let settled = false;
		const settle = (s: GeoState) => {
			if (!settled) {
				settled = true;
				setState(s);
			}
		};
		const timer = setTimeout(() => settle({ status: "denied" }), timeoutMs);

		navigator.geolocation.getCurrentPosition(
			(pos) => {
				clearTimeout(timer);
				const { latitude: lat, longitude: lng } = pos.coords;
				settle({ status: "granted", lat, lng, inJeju: isInJeju(lat, lng) });
			},
			() => {
				clearTimeout(timer);
				settle({ status: "denied" });
			},
			{ maximumAge: 60_000, timeout: timeoutMs, enableHighAccuracy: false },
		);
		return () => clearTimeout(timer);
	}, [timeoutMs]);

	return state;
}
