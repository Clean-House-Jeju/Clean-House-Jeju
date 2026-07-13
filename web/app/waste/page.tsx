import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import { getWasteGuide } from "@/lib/waste";
import guideStyles from "../guide/page.module.css";
import WasteIndex from "./WasteIndex";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "분리배출 품목 사전 — 이건 어디에 버리지?",
	description:
		"플라스틱·폐건전지·폐의약품·대형폐기물까지, 제주에서 품목별로 어디에 어떻게 버리는지 한눈에 찾아보세요.",
	alternates: { canonical: "/waste" },
};

export default function WastePage() {
	const { entries, verifiedAt } = getWasteGuide();

	return (
		<>
			<SiteHeader />
			<main className={guideStyles.main}>
				<h1>분리배출 품목 사전</h1>
				<p className={guideStyles.lead}>
					"이건 어디에 버리지?" — 품목을 검색하면 배출 장소와 방법을 알려드립니다.
				</p>
				<WasteIndex entries={entries} />
				<p className={guideStyles.meta}>확인일 {verifiedAt} · 제주시·서귀포시 공식 안내 기준</p>
			</main>
		</>
	);
}
