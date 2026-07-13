// 클라이언트에서도 쓰는 품목 사전 타입·라벨 (fs 의존 없음)
import type { Item } from "./types";

export type WasteWhere = "clean-house" | "help-center" | "both" | "special";

export interface WasteEntry {
	slug: string;
	name: string;
	aliases: string[];
	item?: Item;
	where: WasteWhere;
	service?: string;
	howTo: string[];
	caution: string[];
	links?: { label: string; url: string }[];
}

export const WHERE_LABELS: Record<WasteWhere, string> = {
	"clean-house": "클린하우스",
	"help-center": "재활용도움센터",
	both: "클린하우스 · 재활용도움센터",
	special: "별도 절차",
};

export const SERVICE_LABELS: Record<string, string> = {
	smallAppliances: "소형 폐가전 무상 배출",
	depositRefund: "캔·페트·폐건전지·종이팩 보상 수거",
	medicine: "가정용 폐의약품 수거",
	cookingOil: "가정용 폐식용유 수거",
	bottleRefund: "빈 병 보증금 환불",
	pesticide: "폐농약 안심 처리",
};
