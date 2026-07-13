import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { getDataAsOf } from "@/lib/data";
import { getEmdGroups } from "@/lib/emd";
import { DISTRICT_LABELS } from "@/lib/rules";
import type { District } from "@/lib/types";
import styles from "../guide/page.module.css";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "제주 클린하우스 위치 안내",
	description: "제주시·서귀포시 읍면동별 클린하우스 위치 안내 — 우리 동네 클린하우스를 찾아보세요.",
	alternates: { canonical: "/clean-house" },
};

export default function CleanHouseIndexPage() {
	const groups = getEmdGroups();
	const byDistrict: Record<District, typeof groups> = { jeju: [], seogwipo: [] };
	for (const g of groups) byDistrict[g.district].push(g);
	const total = groups.reduce((n, g) => n + g.sites.length, 0);

	return (
		<>
			<SiteHeader />
			<main className={styles.main}>
				<h1>클린하우스</h1>
				<p className={styles.lead}>
					클린하우스는 생활쓰레기·재활용품 거점 수거시설로, <Link href="/guide">요일별 배출제</Link>가 적용됩니다.
					현재 {total.toLocaleString()}개소의 위치 정보를 제공합니다. 읍면동을 선택하면 상세 목록을 볼 수 있습니다.
				</p>
				{(Object.keys(byDistrict) as District[]).map((district) => (
					<section key={district} className={styles.district}>
						<h2>{DISTRICT_LABELS[district]}</h2>
						<ul className={styles.notes}>
							{byDistrict[district].map((g) => (
								<li key={g.emd}>
									<Link href={`/clean-house/${district}/${encodeURIComponent(g.emd)}`}>
										{g.emd} 클린하우스 ({g.sites.length}개소)
									</Link>
								</li>
							))}
						</ul>
					</section>
				))}
				<p className={styles.meta}>데이터 기준일 {getDataAsOf()}</p>
			</main>
		</>
	);
}
