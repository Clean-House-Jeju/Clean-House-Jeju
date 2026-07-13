import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import { getSiteById } from "@/lib/data";
import guideStyles from "../guide/page.module.css";
import ReportForm from "./ReportForm";

export const metadata: Metadata = {
	title: "정보 오류 제보",
	description: "클린하우스·재활용도움센터 정보가 실제와 다르면 알려주세요. 확인 후 데이터에 반영합니다.",
	robots: { index: false },
};

export default async function ReportPage({
	searchParams,
}: {
	searchParams: Promise<{ site?: string }>;
}) {
	const { site: siteId } = await searchParams;
	const site = siteId ? getSiteById(siteId) : undefined;

	return (
		<>
			<SiteHeader />
			<main className={guideStyles.main}>
				<h1>정보 오류 제보</h1>
				<p className={guideStyles.lead}>
					공공데이터와 실제 현장이 다를 수 있습니다. 달라진 점을 알려주시면 확인 후 반영하겠습니다.
				</p>
				<ReportForm siteId={site?.id} siteName={site?.name} />
			</main>
		</>
	);
}
