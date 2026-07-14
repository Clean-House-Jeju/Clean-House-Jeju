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
				{/* 부트스트랩: ① Astryx 다크모드 동기화 ② 구버전 iOS 앱 safe-area 폴백
				    (WKWebView는 env()가 0 — 새 빌드는 네이티브가 --cj-safe-*를 주입하고,
				     주입이 없는 구빌드는 기기 높이 휴리스틱으로 보정) */}
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: 렌더 전 부트스트랩
					dangerouslySetInnerHTML={{
						__html: `(function(){var m=matchMedia('(prefers-color-scheme: dark)');var s=function(){document.documentElement.dataset.astryxMedia=m.matches?'dark':'light'};s();m.addEventListener('change',s)})();
(function(){if(navigator.userAgent.indexOf('CleanJejuApp')===-1)return;var st=document.documentElement.style;if(st.getPropertyValue('--cj-safe-top'))return;var h=Math.max(screen.height,screen.width);var t=h>=852?59:(h>=812?47:20);var b=h>=812?34:0;st.setProperty('--cj-safe-top',t+'px');st.setProperty('--cj-safe-bottom',b+'px')})();`,
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
