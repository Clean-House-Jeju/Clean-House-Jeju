import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:8080"),
	title: {
		default: "클린 제주 — 제주 클린하우스·재활용도움센터 안내",
		template: "%s | 클린 제주",
	},
	description:
		"제주 클린하우스와 재활용도움센터 위치, 오늘 배출 가능한 재활용품, 요일별 배출제 안내",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="ko" data-astryx-theme="neutral">
			<body>{children}</body>
		</html>
	);
}
