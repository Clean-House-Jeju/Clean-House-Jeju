import type { Metadata, Viewport } from "next";
import BottomNav from "@/components/BottomNav";
import PwaSetup from "@/components/PwaSetup";
import "./globals.css";

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:8080"),
	title: {
		default: "클린 제주 — 제주 클린하우스·재활용도움센터 안내",
		template: "%s | 클린 제주",
	},
	description:
		"제주 클린하우스와 재활용도움센터 위치, 오늘 배출 가능한 재활용품, 요일별 배출제 안내",
	openGraph: {
		siteName: "클린 제주",
		images: [{ url: "/og.png", width: 1200, height: 630 }],
		locale: "ko_KR",
		type: "website",
	},
	appleWebApp: { capable: true, title: "클린 제주", statusBarStyle: "default" },
	icons: { apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#1a232b" },
	],
	viewportFit: "cover",
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="ko" data-astryx-theme="neutral" suppressHydrationWarning>
			<head>
				{/* Astryx 다크모드를 시스템 설정과 동기화 (FOUC 방지 위해 렌더 전 실행) */}
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: 테마 동기화 부트스트랩
					dangerouslySetInnerHTML={{
						__html: `(function(){var m=matchMedia('(prefers-color-scheme: dark)');var s=function(){document.documentElement.dataset.astryxMedia=m.matches?'dark':'light'};s();m.addEventListener('change',s)})()`,
					}}
				/>
			</head>
			<body>
				{children}
				<BottomNav />
				<PwaSetup />
			</body>
		</html>
	);
}
