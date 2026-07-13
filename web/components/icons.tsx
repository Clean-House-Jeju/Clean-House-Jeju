import type { ReactNode, SVGProps } from "react";
import type { Item } from "@/lib/types";

/**
 * 배출 품목 아이콘 세트 — Astryx 내장 레지스트리(UI 크롬용)에 없는 도메인 아이콘.
 * stroke=currentColor라 칩·카드의 텍스트 색을 그대로 따른다.
 */

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

const ITEM_PATHS: Record<Item, ReactNode> = {
	// 종량제: 뚜껑 있는 쓰레기통
	general: (
		<>
			<path d="M4.5 6h11l-1 11h-9z" />
			<path d="M3.5 6h13M8 6V4.2h4V6M8.5 9.5v4.5M11.5 9.5v4.5" />
		</>
	),
	// 음식물: 그릇 + 김
	food: (
		<>
			<path d="M3.5 11h13a6.5 6.5 0 0 1-13 0Z" />
			<path d="M7.5 7.5c0-1 1-1.4 1-2.4M11.5 7.5c0-1 1-1.4 1-2.4" />
		</>
	),
	// 플라스틱: 페트병
	plastic: (
		<>
			<path d="M8.4 2.8h3.2M8.8 2.8v2.1c0 .8-2.3 2-2.3 4v7.3a1.3 1.3 0 0 0 1.3 1.3h4.4a1.3 1.3 0 0 0 1.3-1.3V8.9c0-2-2.3-3.2-2.3-4V2.8" />
			<path d="M6.5 11h7M6.5 14h7" />
		</>
	),
	// 투명페트병: 페트병 + 반짝
	"pet-clear": (
		<>
			<path d="M8.8 3h2.4M9 3v1.8c0 .7-2 1.8-2 3.6v7.4a1.2 1.2 0 0 0 1.2 1.2h3.6a1.2 1.2 0 0 0 1.2-1.2V8.4c0-1.8-2-2.9-2-3.6V3" />
			<path d="M16.2 4.4v3M14.7 5.9h3" strokeWidth="1.4" />
		</>
	),
	// 종이: 상자
	paper: (
		<>
			<path d="M3.5 7 10 4l6.5 3v8L10 18l-6.5-3z" />
			<path d="M3.5 7 10 10l6.5-3M10 10v8" />
		</>
	),
	// 비닐: 봉투
	vinyl: (
		<>
			<path d="M5 7.5h10l-.8 9.5H5.8Z" />
			<path d="M7.5 7.5V6a2.5 2.5 0 0 1 5 0v1.5" />
		</>
	),
	// 불연성: 마대
	nonflammable: (
		<>
			<path d="M6.5 5.5h7l1.5 3.5v6.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 5 15.5V9Z" />
			<path d="M6.5 5.5 6 3.5h8l-.5 2M5 9h10" />
		</>
	),
	// 캔·고철: 캔
	"can-metal": (
		<>
			<ellipse cx="10" cy="4.8" rx="4.5" ry="1.8" />
			<path d="M5.5 4.8v10.4c0 1 2 1.8 4.5 1.8s4.5-.8 4.5-1.8V4.8" />
			<path d="M5.5 8.4c1.5 2 7.5 2 9 0" />
		</>
	),
	// 병류: 유리병
	glass: (
		<>
			<path d="M8.6 2.8h2.8M8.8 2.8v3.4c0 1.2 1.8 1.6 1.8 3.4v6.6a1.3 1.3 0 0 1-1.3 1.3H8.3A1.3 1.3 0 0 1 7 16.2V9.6c0-1.8 1.8-2.2 1.8-3.4V2.8" transform="translate(1.5 0)" />
		</>
	),
	// 스티로폼: 입체 박스
	styrofoam: (
		<>
			<path d="M3.5 6.5 10 3.5l6.5 3v7L10 16.5l-6.5-3z" />
			<path d="M3.5 6.5 10 9.5l6.5-3M10 9.5v7M6.8 5 13 8" />
		</>
	),
};

export function ItemIcon({ item, size }: { item: Item; size?: number }) {
	return <Svg size={size}>{ITEM_PATHS[item]}</Svg>;
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

/** 닫기 */
export function CloseIcon({ size = 16 }: { size?: number }) {
	return (
		<Svg size={size} strokeWidth={2}>
			<path d="M5 5l10 10M15 5 5 15" />
		</Svg>
	);
}
