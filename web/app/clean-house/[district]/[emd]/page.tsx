import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { getDataAsOf, getRules } from "@/lib/data";
import { getEmdGroup, getEmdGroups } from "@/lib/emd";
import { DISTRICT_LABELS, ruleForDistrict } from "@/lib/rules";
import type { District } from "@/lib/types";
import styles from "../../../guide/page.module.css";

export const revalidate = 3600;

interface Params {
	district: District;
	emd: string;
}

export function generateStaticParams() {
	return getEmdGroups().map((g) => ({ district: g.district, emd: g.emd }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
	const { district, emd: rawEmd } = await params;
	const emd = decodeURIComponent(rawEmd);
	const group = getEmdGroup(district, emd);
	if (!group) return {};
	return {
		title: `${DISTRICT_LABELS[district]} ${emd} 클린하우스 ${group.sites.length}개소 위치`,
		description: `${DISTRICT_LABELS[district]} ${emd} 클린하우스 전체 위치 목록 — 주소와 길찾기, 요일별 배출 규칙을 확인하세요.`,
		alternates: { canonical: `/clean-house/${district}/${encodeURIComponent(emd)}` },
	};
}

export default async function EmdPage({ params }: { params: Promise<Params> }) {
	const { district, emd: rawEmd } = await params;
	const emd = decodeURIComponent(rawEmd);
	const group = getEmdGroup(district, emd);
	if (!group) notFound();

	const rule = ruleForDistrict(getRules().rules, district);

	return (
		<>
			<SiteHeader />
			<main className={styles.main}>
				<h1>
					{DISTRICT_LABELS[district]} {emd} 클린하우스
				</h1>
				<p className={styles.lead}>
					{emd}에는 클린하우스 {group.sites.length}개소가 있습니다.{" "}
					{rule?.cleanHouseHours
						? `배출 시간은 ${rule.cleanHouseHours.start}~익일 ${rule.cleanHouseHours.end}이며, `
						: ""}
					품목별 배출 요일은 <Link href="/guide">요일별 배출제 안내</Link>를 확인하세요.
				</p>
				<section className={styles.district}>
					<h2>위치 목록</h2>
					<ul className={styles.notes}>
						{group.sites.map((s) => (
							<li key={s.id}>
								<strong>{s.name}</strong> — {s.address}{" "}
								<a
									href={`https://map.kakao.com/link/to/${encodeURIComponent(`${emd} 클린하우스 ${s.name}`)},${s.lat},${s.lng}`}
									target="_blank"
									rel="noreferrer"
								>
									길찾기
								</a>
							</li>
						))}
					</ul>
				</section>
				<p className={styles.meta}>
					데이터 기준일 {getDataAsOf()} · <Link href="/clean-house">← 읍면동 목록</Link>
				</p>
			</main>
		</>
	);
}
