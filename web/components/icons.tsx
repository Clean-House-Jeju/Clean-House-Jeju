import type { ReactNode, SVGProps } from "react";
import type { Item } from "@/lib/types";

/**
 * 아이콘 세트
 * - 품목 아이콘: 풀컬러 플랫 일러스트 (고유 팔레트 + 음영 + 하이라이트)
 * - UI 아이콘(닫기·체크·내비 등): 단색 스트로크, currentColor
 */

/* ================= 품목 아이콘 (풀컬러) ================= */

const ITEM_ART: Record<Item, ReactNode> = {
	// 종량제: 흰 봉투 + 파란 밴드, 묶인 매듭
	general: (
		<>
			<path d="M7.2 5.6 6 3.4h2l.7 1.5h2.6l.7-1.5h2l-1.2 2.2Z" fill="#aeb9c4" />
			<path d="M5.2 7.6C4.6 12 4.4 14.8 4.6 16.1c.2 1 1 1.6 2 1.6h6.8c1 0 1.8-.6 2-1.6.2-1.3 0-4.1-.6-8.5-.1-.8-.8-1.4-1.6-1.4H6.8c-.8 0-1.5.6-1.6 1.4Z" fill="#f2f6f9" />
			<path d="M13.2 6.2c.8 0 1.5.6 1.6 1.4.6 4.4.8 7.2.6 8.5-.2 1-1 1.6-2 1.6h-1.8c2.4-3.6 2.6-8.6 1-11.5Z" fill="#d8e1e8" />
			<path d="M4.9 10.2h10.2l.2 2.2H4.7Z" fill="#4a90d9" />
			<path d="M8 3.4h1.4L9 5.6H7.9Z" fill="#8f9ba6" />
		</>
	),
	// 음식물: 노란 수거통 + 초록 새싹
	food: (
		<>
			<path d="M10.6 4.8c.2-1 .9-1.8 2.2-2 0 1.2-.5 2-1.4 2.4Z" fill="#57b26b" />
			<path d="M9.6 5.2c-.5-.9-1.5-1.4-2.7-1.2.3 1.1 1.1 1.7 2.2 1.7Z" fill="#3f9655" />
			<rect x="4.6" y="5.8" width="10.8" height="2.6" rx="1.1" fill="#f2a51f" />
			<path d="M5.6 8.4h8.8l-.7 8a1.6 1.6 0 0 1-1.6 1.4H7.9a1.6 1.6 0 0 1-1.6-1.4Z" fill="#ffc531" />
			<path d="M14.4 8.4l-.7 8a1.6 1.6 0 0 1-1.6 1.4h-1.5c1.4-2.7 1.8-6 1.4-9.4Z" fill="#f2a51f" />
			<rect x="8.2" y="10.4" width="3.6" height="1.2" rx="0.6" fill="#d98a12" />
		</>
	),
	// 플라스틱: 하늘색 페트병
	plastic: (
		<>
			<rect x="8.3" y="2.4" width="3.4" height="1.7" rx="0.6" fill="#2d9cdb" />
			<path d="M8.7 4.5h2.6v1.1c0 .9 2.1 1.9 2.1 3.9v6.6a1.5 1.5 0 0 1-1.5 1.6H8.1a1.5 1.5 0 0 1-1.5-1.6V9.5c0-2 2.1-3 2.1-3.9Z" fill="#9ed4f0" />
			<path d="M11.3 4.5v1.1c0 .9 2.1 1.9 2.1 3.9v6.6a1.5 1.5 0 0 1-1.5 1.6h-1.6c1-2.2 1.3-9 .1-13.2Z" fill="#6fbde8" />
			<rect x="6.6" y="10.6" width="6.8" height="3.4" rx="0.5" fill="#e8f5fc" />
			<path d="M7.5 5.9h1v9.4h-1Z" fill="#cdeaf8" opacity="0.9" />
		</>
	),
	// 투명페트병: 투명 병 + 반짝
	"pet-clear": (
		<>
			<rect x="7.9" y="2.2" width="3.2" height="1.6" rx="0.6" fill="#2d9cdb" />
			<path d="M8.3 4.2h2.4v1c0 .9 2 1.8 2 3.7v6.9a1.5 1.5 0 0 1-1.5 1.5H7.8a1.5 1.5 0 0 1-1.5-1.5V8.9c0-1.9 2-2.8 2-3.7Z" fill="#e6f4fb" />
			<path d="M10.7 4.2v1c0 .9 2 1.8 2 3.7v6.9a1.5 1.5 0 0 1-1.5 1.5H10c1-2.3 1.2-8.9 0-13.1Z" fill="#c9e8f7" />
			<path d="M7.3 6.2h.9v9.2h-.9Z" fill="#ffffff" opacity="0.85" />
			<path d="M15.6 3.4v3M14.1 4.9h3" stroke="#ffd84d" strokeWidth="1.5" strokeLinecap="round" fill="none" />
		</>
	),
	// 종이: 크라프트 박스
	paper: (
		<>
			<path d="M3.6 6.8 10 3.8l6.4 3-6.4 3Z" fill="#e0b071" />
			<path d="M3.6 6.8 10 9.8v6.8l-6.4-3Z" fill="#c8934e" />
			<path d="M16.4 6.8 10 9.8v6.8l6.4-3Z" fill="#b57f3c" />
			<path d="M9.4 3.9 15.5 7v2l-6.1-3Z" fill="#f2d6ab" opacity="0.55" />
			<path d="M9.5 9.9h1v6.9h-1Z" fill="#8f6227" opacity="0.4" />
		</>
	),
	// 비닐: 반투명 봉투
	vinyl: (
		<>
			<path d="M6.6 5.4V4.6a3.4 3.4 0 0 1 6.8 0v.8h-1.6v-.8a1.8 1.8 0 0 0-3.6 0v.8Z" fill="#d9b23f" />
			<path d="M5 6.2h10l-.8 9.8a1.5 1.5 0 0 1-1.5 1.4H7.3a1.5 1.5 0 0 1-1.5-1.4Z" fill="#ffe27a" />
			<path d="M15 6.2l-.8 9.8a1.5 1.5 0 0 1-1.5 1.4h-1.5c1.2-2.4 1.6-7.7 1-11.2Z" fill="#f5cd4e" />
			<path d="M6.6 7.6h1.1v8h-1Z" fill="#fff3bd" opacity="0.9" />
		</>
	),
	// 불연성: 회색 마대
	nonflammable: (
		<>
			<path d="M7 5.5 6.4 3.3h7.2L13 5.5Z" fill="#7d8792" />
			<path d="M6.2 6.4h7.6c.9 1.2 1.5 2.6 1.5 4.5v4.6a1.9 1.9 0 0 1-1.9 1.9H6.6a1.9 1.9 0 0 1-1.9-1.9v-4.6c0-1.9.6-3.3 1.5-4.5Z" fill="#aab3bc" />
			<path d="M13.8 6.4c.9 1.2 1.5 2.6 1.5 4.5v4.6a1.9 1.9 0 0 1-1.9 1.9h-1.8c1.5-2.6 1.9-7.6.7-11Z" fill="#8f99a3" />
			<path d="M4.9 10h10.4v1.3H4.9Z" fill="#6b7480" opacity="0.5" />
			<path d="M6.1 7.7h1v7.6h-1Z" fill="#cfd6dc" opacity="0.85" />
		</>
	),
	// 캔·고철: 은색 캔 + 레드 밴드
	"can-metal": (
		<>
			<ellipse cx="10" cy="4.6" rx="4.6" ry="1.7" fill="#d7dee4" />
			<ellipse cx="10" cy="4.6" rx="3.1" ry="1" fill="#aeb9c2" />
			<path d="M5.4 4.6v10.6c0 1 2 1.8 4.6 1.8s4.6-.8 4.6-1.8V4.6c0 1-2 1.7-4.6 1.7s-4.6-.7-4.6-1.7Z" fill="#e8edf1" />
			<path d="M14.6 4.6v10.6c0 1-2 1.8-4.6 1.8-.8 0-1.6-.1-2.3-.2 2.6-.6 3.9-1.2 3.9-2.7V6.2c1.8-.2 3-.9 3-1.6Z" fill="#c3ccd4" />
			<path d="M5.4 8.7c1.3 1 8 1 9.2 0v2.6c-1.3 1-8 1-9.2 0Z" fill="#e2574c" />
			<path d="M6.3 5.9h.9v9.8h-.9Z" fill="#f7fafc" opacity="0.9" />
		</>
	),
	// 병류: 초록 유리병
	glass: (
		<>
			<rect x="8.9" y="2.2" width="2.2" height="1.4" rx="0.5" fill="#8a6d3b" />
			<path d="M9.1 3.8h1.8v2.6c0 1.3 2 1.8 2 3.8v5.6a1.5 1.5 0 0 1-1.5 1.6H8.6a1.5 1.5 0 0 1-1.5-1.6v-5.6c0-2 2-2.5 2-3.8Z" fill="#43a05f" />
			<path d="M10.9 3.8v2.6c0 1.3 2 1.8 2 3.8v5.6a1.5 1.5 0 0 1-1.5 1.6h-1.3c.9-2.1 1.2-8.5 0-13.6Z" fill="#2e7d46" />
			<rect x="7.4" y="11" width="5.6" height="3" rx="0.4" fill="#f5f2e3" />
			<path d="M8 6.5h.8v3.4H8Z" fill="#a8dcb8" opacity="0.85" />
		</>
	),
	// 스티로폼: 흰 박스 + 하늘 테이프
	styrofoam: (
		<>
			<path d="M3.8 6.9 10 4l6.2 2.9L10 9.8Z" fill="#fbfdfe" />
			<path d="M3.8 6.9 10 9.8v6.6l-6.2-2.9Z" fill="#dde7ee" />
			<path d="M16.2 6.9 10 9.8v6.6l6.2-2.9Z" fill="#c5d3dd" />
			<path d="M8.4 4.7 14.7 7.6v1.6L8.4 6.3Z" fill="#9ed4f0" opacity="0.8" />
			<path d="M9.5 9.9h1v6.7h-1Z" fill="#a9bac7" opacity="0.5" />
		</>
	),
};

export function ItemIcon({ item, size = 16 }: { item: Item; size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
			{ITEM_ART[item]}
		</svg>
	);
}

/* ================= UI 아이콘 (단색 스트로크) ================= */

function Svg({ children, size = 15, ...rest }: SVGProps<SVGSVGElement> & { size?: number; children: ReactNode }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 20 20"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.7"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...rest}
		>
			{children}
		</svg>
	);
}

/** 체크 (제공 서비스 목록 등) */
export function CheckIcon({ size = 15 }: { size?: number }) {
	return (
		<Svg size={size}>
			<path d="M3.5 10.5 8 15 16.5 5.5" />
		</Svg>
	);
}

/** 운영마감 (달) */
export function MoonIcon({ size = 13 }: { size?: number }) {
	return (
		<Svg size={size}>
			<path d="M16 12.2A7 7 0 0 1 7.8 4 7 7 0 1 0 16 12.2Z" />
		</Svg>
	);
}

/** 즐겨찾기 별 */
export function StarIcon({ size = 16, filled = false }: { size?: number; filled?: boolean }) {
	return (
		<Svg size={size} fill={filled ? "currentColor" : "none"} strokeWidth={1.6}>
			<path d="M10 2.8 12.2 7.3l5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 8l5-.7Z" />
		</Svg>
	);
}

/** 지금 열린 곳 (번개) */
export function BoltIcon({ size = 14 }: { size?: number }) {
	return (
		<Svg size={size} fill="currentColor" strokeWidth={0.5}>
			<path d="M11.2 2 4.5 11h4l-.9 7 6.9-9.2h-4Z" />
		</Svg>
	);
}

/** 알림 벨 */
export function BellIcon({ size = 16 }: { size?: number }) {
	return (
		<Svg size={size}>
			<path d="M10 3a4.6 4.6 0 0 0-4.6 4.6c0 4-1.6 5.4-1.6 5.4h12.4s-1.6-1.4-1.6-5.4A4.6 4.6 0 0 0 10 3Z" />
			<path d="M8.4 16a1.7 1.7 0 0 0 3.2 0" />
		</Svg>
	);
}

/** 검색 (돋보기) */
export function SearchIcon({ size = 17 }: { size?: number }) {
	return (
		<Svg size={size}>
			<circle cx="9" cy="9" r="5.5" />
			<path d="m13.2 13.2 3.6 3.6" />
		</Svg>
	);
}

/** 현위치 (타겟) */
export function TargetIcon({ size = 19 }: { size?: number }) {
	return (
		<Svg size={size}>
			<circle cx="10" cy="10" r="5.6" />
			<circle cx="10" cy="10" r="1.6" fill="currentColor" stroke="none" />
			<path d="M10 1.8v3M10 15.2v3M1.8 10h3M15.2 10h3" />
		</Svg>
	);
}

/** 닫기 */
export function CloseIcon({ size = 16 }: { size?: number }) {
	return (
		<Svg size={size} strokeWidth={2}>
			<path d="M5 5l10 10M15 5 5 15" />
		</Svg>
	);
}

/* ---- 하단 내비게이션용 (20 그리드, stroke 1.7, round) ---- */

export function MapNavIcon({ size = 22 }: { size?: number }) {
	return (
		<Svg size={size}>
			<path d="M10 17.8C10 17.8 16 12.2 16 8.1a6 6 0 1 0-12 0c0 4.1 6 9.7 6 9.7Z" />
			<circle cx="10" cy="8.1" r="2.1" />
		</Svg>
	);
}

/** 배출 안내 = 요일 캘린더 + 체크 */
export function GuideNavIcon({ size = 22 }: { size?: number }) {
	return (
		<Svg size={size}>
			<rect x="3.4" y="4.6" width="13.2" height="12.6" rx="2.2" />
			<path d="M3.4 8.4h13.2M6.9 2.6v3M13.1 2.6v3" />
			<path d="M7.3 12.6l1.8 1.8 3.6-3.7" />
		</Svg>
	);
}

/** 재활용 삼각 화살표 (chasing arrows) — 1개 화살을 120°씩 회전 복제 */
export function RecycleNavIcon({ size = 22 }: { size?: number }) {
	const arrow = (
		<>
			<path d="M11.16 6.28 14.06 11.48" />
			<path d="M15.1 13.35 15.66 10.4 12.5 12.2 Z" fill="currentColor" stroke="none" />
		</>
	);
	return (
		<Svg size={size} strokeWidth={1.8}>
			{arrow}
			<g transform="rotate(120 10 11.1)">{arrow}</g>
			<g transform="rotate(240 10 11.1)">{arrow}</g>
		</Svg>
	);
}

export function HouseNavIcon({ size = 22 }: { size?: number }) {
	return (
		<Svg size={size}>
			<path d="M3.8 9.8 10 4.2l6.2 5.6" />
			<path d="M5.5 8.8v6.4a1.7 1.7 0 0 0 1.7 1.7h5.6a1.7 1.7 0 0 0 1.7-1.7V8.8" />
			<path d="M8.6 16.9v-3.2a1.4 1.4 0 0 1 2.8 0v3.2" />
		</Svg>
	);
}
