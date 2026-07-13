import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import styles from "../page.module.css";

export const metadata: Metadata = {
	title: "자주 묻는 질문 (FAQ)",
	description: "제주 쓰레기 배출 FAQ — 요일별 배출제, 클린하우스와 재활용도움센터의 차이, 배출 시간, 과태료 등.",
	alternates: { canonical: "/guide/faq" },
};

const FAQS = [
	{
		q: "클린하우스와 재활용도움센터는 뭐가 다른가요?",
		a: "클린하우스는 무인 거점 수거시설로 요일별 배출제가 적용됩니다. 재활용도움센터는 도우미가 상주하는 시설로 요일 구분 없이 재활용품을 배출할 수 있고, 소형 폐가전 무상 배출·캔/페트 보상 수거 등 추가 서비스를 제공합니다.",
	},
	{
		q: "오늘 무엇을 버릴 수 있는지 어떻게 확인하나요?",
		a: "클린 제주 첫 화면 상단에 오늘 배출 가능한 품목이 제주시·서귀포시별로 표시됩니다. 종량제봉투(일반쓰레기), 음식물, 캔·고철, 병류, 스티로폼은 요일과 무관하게 매일 배출할 수 있습니다.",
	},
	{
		q: "배출 시간은 언제인가요?",
		a: "제주시 클린하우스는 15:00부터 다음 날 04:00까지 배출할 수 있습니다(음식물류는 24시간). 재활용도움센터는 대부분 06:00~22:00 운영하며 개소마다 다를 수 있으니 상세 페이지에서 확인하세요.",
	},
	{
		q: "요일을 지키지 않고 배출하면 어떻게 되나요?",
		a: "폐기물관리법 및 도 조례에 따라 무단투기·요일 위반 배출 시 과태료가 부과될 수 있습니다. 급하면 요일제가 없는 재활용도움센터를 이용하세요.",
	},
	{
		q: "투명 페트병은 어떻게 버리나요?",
		a: "내용물을 비우고 라벨을 제거한 뒤 찌그러뜨려 뚜껑을 닫아, 플라스틱 배출 요일에 투명 페트병 전용 수거함에 배출합니다.",
	},
	{
		q: "이 사이트의 데이터는 어디서 오나요?",
		a: "공공데이터포털(data.go.kr)의 제주시·서귀포시 클린하우스 현황과 제주특별자치도 재활용도움센터 현황 데이터를 주기적으로 자동 수집해 보여줍니다. 각 화면에 데이터 기준일이 표시됩니다.",
	},
];

export default function FaqPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: FAQS.map((f) => ({
			"@type": "Question",
			name: f.q,
			acceptedAnswer: { "@type": "Answer", text: f.a },
		})),
	};

	return (
		<>
			<SiteHeader />
			<main className={styles.main}>
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD 구조화 데이터
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
				<h1>자주 묻는 질문</h1>
				{FAQS.map((f) => (
					<section key={f.q} className={styles.district}>
						<h2>{f.q}</h2>
						<p className={styles.lead}>{f.a}</p>
					</section>
				))}
				<p className={styles.meta}>
					<Link href="/guide">← 요일별 배출제 안내</Link>
				</p>
			</main>
		</>
	);
}
