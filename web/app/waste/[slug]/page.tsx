import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckIcon, ItemIcon } from "@/components/icons";
import SiteHeader from "@/components/SiteHeader";
import { getRules } from "@/lib/data";
import { DAY_LABELS, DISTRICT_LABELS } from "@/lib/rules";
import type { Day } from "@/lib/types";
import { getWasteEntry, getWasteGuide, SERVICE_LABELS, WHERE_LABELS } from "@/lib/waste";
import guideStyles from "../../guide/page.module.css";
import styles from "../page.module.css";

export const revalidate = 3600;

const DAYS: Day[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export function generateStaticParams() {
	return getWasteGuide().entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	const entry = getWasteEntry(slug);
	if (!entry) return {};
	return {
		title: `${entry.name} 버리는 법 — 제주 분리배출`,
		description: `제주에서 ${entry.name} 배출 방법: ${WHERE_LABELS[entry.where]}에 ${entry.howTo[0]}`,
		alternates: { canonical: `/waste/${entry.slug}` },
	};
}

export default async function WasteDetail({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const entry = getWasteEntry(slug);
	if (!entry) notFound();

	const { rules } = getRules();
	// 요일제 품목이면 시별 배출 요일 자동 표시 (rules.json 연동)
	const scheduleRows =
		entry.item &&
		rules
			.map((rule) => ({
				district: rule.district,
				days: DAYS.filter((d) => rule.schedule[d].includes(entry.item as never)),
				always: rule.alwaysAllowed.includes(entry.item as never),
			}))
			.filter((r) => r.days.length > 0 || r.always);

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "HowTo",
		name: `제주에서 ${entry.name} 버리는 법`,
		step: entry.howTo.map((t, i) => ({ "@type": "HowToStep", position: i + 1, text: t })),
	};

	return (
		<>
			<SiteHeader />
			<main className={guideStyles.main}>
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD 구조화 데이터
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
				<div className={styles.detailHead}>
					{entry.item && <ItemIcon item={entry.item} size={40} />}
					<div>
						<h1>{entry.name}</h1>
						<p className={styles.whereBadge} data-where={entry.where}>
							배출 장소: {WHERE_LABELS[entry.where]}
							{entry.service && ` — ${SERVICE_LABELS[entry.service]}`}
						</p>
					</div>
				</div>

				{scheduleRows && scheduleRows.length > 0 && (
					<section className={guideStyles.district}>
						<h2>배출 요일</h2>
						<ul className={guideStyles.notes}>
							{scheduleRows.map((r) => (
								<li key={r.district}>
									<strong>{DISTRICT_LABELS[r.district]}</strong>:{" "}
									{r.always ? "매일 배출 가능" : `${r.days.map((d) => DAY_LABELS[d]).join("·")}요일`}
								</li>
							))}
						</ul>
					</section>
				)}

				<section className={guideStyles.district}>
					<h2>이렇게 버리세요</h2>
					<ol className={styles.steps}>
						{entry.howTo.map((t) => (
							<li key={t}>{t}</li>
						))}
					</ol>
				</section>

				{entry.caution.length > 0 && (
					<section className={guideStyles.district}>
						<h2>주의</h2>
						<ul className={guideStyles.notes}>
							{entry.caution.map((t) => (
								<li key={t}>{t}</li>
							))}
						</ul>
					</section>
				)}

				<section className={guideStyles.district}>
					<h2>바로가기</h2>
					<ul className={guideStyles.notes}>
						{(entry.where === "help-center" || entry.where === "both") && (
							<li className={styles.item}>
								<CheckIcon /> <Link href="/recycle-center">가까운 재활용도움센터 찾기 (요일 무관)</Link>
							</li>
						)}
						{(entry.where === "clean-house" || entry.where === "both") && (
							<li className={styles.item}>
								<CheckIcon /> <Link href="/">지도에서 가까운 클린하우스 찾기</Link>
							</li>
						)}
						{entry.links?.map((l) => (
							<li key={l.url} className={styles.item}>
								<CheckIcon />{" "}
								<a href={l.url} target="_blank" rel="noreferrer">
									{l.label}
								</a>
							</li>
						))}
						<li className={styles.item}>
							<CheckIcon /> <Link href="/guide">요일별 배출제 전체 안내</Link>
						</li>
					</ul>
				</section>

				<p className={guideStyles.meta}>
					<Link href="/waste">← 품목 사전</Link> · 정보가 다르면 <Link href="/report">제보</Link>해 주세요
				</p>
			</main>
		</>
	);
}
