"use client";

// Kakao Maps SDK 로더 — 내부(minified) 프로퍼티 접근 금지, 공식 API만 사용 (constitution)

// biome-ignore lint/suspicious/noExplicitAny: 카카오 SDK는 공식 타입 패키지가 없음
export type KakaoNS = any;

declare global {
	interface Window {
		kakao?: KakaoNS;
	}
}

let loading: Promise<KakaoNS> | null = null;

export function loadKakaoMaps(): Promise<KakaoNS> {
	if (typeof window === "undefined") return Promise.reject(new Error("client only"));
	if (window.kakao?.maps?.Map) return Promise.resolve(window.kakao);
	if (loading) return loading;

	const appKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
	loading = new Promise((resolve, reject) => {
		if (!appKey) {
			reject(new Error("NEXT_PUBLIC_KAKAO_JS_KEY 미설정"));
			return;
		}
		const script = document.createElement("script");
		script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=clusterer&autoload=false`;
		script.async = true;
		script.onload = () => {
			window.kakao.maps.load(() => resolve(window.kakao));
		};
		script.onerror = () => reject(new Error("Kakao Maps SDK 로드 실패 (도메인 등록 확인)"));
		document.head.appendChild(script);
	});
	return loading;
}
