import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckIcon } from "@/components/icons";
import SiteHeader from "@/components/SiteHeader";
import { getDataAsOf, getSiteById, getSites } from "@/lib/data";
import { DISTRICT_LABELS } from "@/lib/rules";
import { formatHours } from "@/lib/status";
import styles from "../../guide/page.module.css";

export const revalidate = 3600;

const SERVICE_LABELS: Record<string, string> = {
	smallAppliances: "소형 폐가전 무상 배출",
	depositRefund: "캔·페트·폐건전지·종이팩 보상 수거",
	medicine: "가정용 폐의약품 수거",
	cookingOil: "가정용 폐식용유 수거",
	bottleRefund: "빈 병 보증금 환불",
	pesticide: "폐농약 안심 처리",
};

export function generateStaticParams() {
	return getSites()
		.filter((s) => s.type === "recycle")
		.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
	const { id } = await params;
	const site = getSiteById(id);
	if (!site) return {};
	return {
		title: `${site.name} — 위치·운영시간·서비스`,
		description: `${site.address} · ${formatHours(site)} · 요일 구분 없이 재활용품 배출 가능. 제공 서비스와 길찾기를 확인하세요.`,
		alternates: { canonical: `/recycle-center/${site.id}` },
	};
}

export default async function RecycleCenterDetail({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const site = getSiteById(id);
	if (!site || site.type !== "recycle") notFound();

	const services = Object.entries(site.services ?? {})
		.filter(([, v]) => v)
		.map(([k]) => SERVICE_LABELS[k])
		.filter(Boolean);

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "CivicStructure",
		name: site.name,
		address: { "@type": "PostalAddress", streetAddress: site.address, addressRegion: "제주특별자치도" },
		geo: { "@type": "GeoCoordinates", latitude: site.lat, longitude: site.lng },
		...(site.openTime && site.closeTime ? { openingHours: `Mo-Su ${site.openTime}-${site.closeTime}` } : {}),
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
				<h1>{site.name}</h1>
				<p className={styles.lead}>
					{DISTRICT_LABELS[site.district]} {site.emd} · 요일 구분 없이 배출 가능
				</p>
				<section className={styles.district}>
					<h2>기본 정보</h2>
					<ul className={styles.notes}>
						<li>주소: {site.address}</li>
						<li>운영시간: {formatHours(site)} (음식물류는 24시간)</li>
					</ul>
					<p>
						<a
							href={`https://map.kakao.com/link/to/${encodeURIComponent(site.name)},${site.lat},${site.lng}`}
							target="_blank"
							rel="noreferrer"
						>
							카카오맵 길찾기 →
						</a>
					</p>
				</section>
				{services.length > 0 && (
					<section className={styles.district}>
						<h2>제공 서비스</h2>
						<ul className={styles.notes}>
							{services.map((s) => (
								<li key={s} className={styles.item}>
									<CheckIcon /> {s}
								</li>
							))}
						</ul>
					</section>
				)}
				<p className={styles.meta}>
					데이터 기준일 {getDataAsOf()} · <Link href="/recycle-center">← 전체 목록</Link> ·{" "}
					<Link href={`/report?site=${site.id}`}>정보가 다른가요? 제보하기</Link>
				</p>
			</main>
		</>
	);
}
