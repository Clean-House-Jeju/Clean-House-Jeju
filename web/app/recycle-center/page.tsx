import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { getDataAsOf, getSites } from "@/lib/data";
import { DISTRICT_LABELS } from "@/lib/rules";
import { formatHours } from "@/lib/status";
import type { District } from "@/lib/types";
import styles from "../guide/page.module.css";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "제주 재활용도움센터 안내",
	description:
		"요일 구분 없이 재활용품을 배출할 수 있는 제주 재활용도움센터 전체 목록 — 위치, 운영시간, 소형 폐가전·보상 수거 등 제공 서비스.",
	alternates: { canonical: "/recycle-center" },
};

export default function RecycleCenterListPage() {
	const centers = getSites().filter((s) => s.type === "recycle");
	const asOf = getDataAsOf();
	const byDistrict: Record<District, typeof centers> = { jeju: [], seogwipo: [] };
	for (const c of centers) byDistrict[c.district].push(c);

	return (
		<>
			<SiteHeader />
			<main className={styles.main}>
				<h1>재활용도움센터</h1>
				<p className={styles.lead}>
					재활용도움센터는 <strong>요일 구분 없이</strong> 재활용품을 배출할 수 있는 유인 시설입니다. 소형 폐가전
					무상 배출, 캔·페트 보상 수거, 폐의약품·폐식용유 수거 등 추가 서비스도 제공합니다. 총{" "}
					{centers.length}개소가 운영 중입니다.
				</p>
				{(Object.keys(byDistrict) as District[]).map((district) => (
					<section key={district} className={styles.district}>
						<h2>
							{DISTRICT_LABELS[district]} ({byDistrict[district].length}개소)
						</h2>
						<ul className={styles.notes}>
							{byDistrict[district].map((c) => (
								<li key={c.id}>
									<Link href={`/recycle-center/${c.id}`}>{c.name}</Link> — {c.emd} · {formatHours(c)}
								</li>
							))}
						</ul>
					</section>
				))}
				<p className={styles.meta}>데이터 기준일 {asOf}</p>
			</main>
		</>
	);
}
