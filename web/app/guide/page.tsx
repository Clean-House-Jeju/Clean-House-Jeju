import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { getDataAsOf, getRules } from "@/lib/data";
import { DAY_LABELS, DISTRICT_LABELS, ITEM_EMOJI, ITEM_LABELS } from "@/lib/rules";
import type { Day } from "@/lib/types";
import styles from "./page.module.css";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "재활용품 요일별 배출제 안내",
	description:
		"제주시·서귀포시 재활용품 요일별 배출제 — 요일별 배출 가능 품목, 배출 시간, 매일 배출 가능 품목을 한눈에 확인하세요.",
	alternates: { canonical: "/guide" },
};

const DAYS: Day[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export default function GuidePage() {
	const { rules, verifiedAt } = getRules();
	const asOf = getDataAsOf();

	return (
		<>
			<SiteHeader />
			<main className={styles.main}>
				<h1>재활용품 요일별 배출제</h1>
				<p className={styles.lead}>
					제주에서는 재활용품을 요일별로 나눠 배출합니다. 클린하우스는 요일제가 적용되고,{" "}
					<Link href="/recycle-center">재활용도움센터</Link>는 요일 구분 없이 배출할 수 있습니다.
				</p>

				{rules.map((rule) => (
					<section key={rule.district} className={styles.district}>
						<h2>{DISTRICT_LABELS[rule.district]}</h2>
						<table className={styles.table}>
							<caption>
								{DISTRICT_LABELS[rule.district]} 요일별 배출 품목 (시행 {rule.effectiveFrom})
							</caption>
							<thead>
								<tr>
									<th scope="col">요일</th>
									<th scope="col">배출 가능 품목</th>
								</tr>
							</thead>
							<tbody>
								{DAYS.map((day) => (
									<tr key={day}>
										<th scope="row">{DAY_LABELS[day]}</th>
										<td>
											{rule.schedule[day].map((i) => `${ITEM_EMOJI[i]} ${ITEM_LABELS[i]}`).join(", ") ||
												"요일제 품목 없음"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<p>
							<strong>매일 배출 가능</strong>:{" "}
							{rule.alwaysAllowed.map((i) => ITEM_LABELS[i]).join(", ")}
						</p>
						{rule.cleanHouseHours && (
							<p>
								<strong>배출 시간</strong>: {rule.cleanHouseHours.start}~익일 {rule.cleanHouseHours.end} (음식물류는
								24시간)
							</p>
						)}
						<ul className={styles.notes}>
							{rule.notes.map((note) => (
								<li key={note}>{note}</li>
							))}
						</ul>
						<p className={styles.source}>
							출처:{" "}
							<a href={rule.source} target="_blank" rel="noreferrer">
								{DISTRICT_LABELS[rule.district]} 공식 안내
							</a>
						</p>
					</section>
				))}

				<p className={styles.meta}>
					규칙 확인일 {verifiedAt} · 개소 데이터 기준일 {asOf} · <Link href="/guide/faq">자주 묻는 질문 →</Link>
				</p>
			</main>
		</>
	);
}
