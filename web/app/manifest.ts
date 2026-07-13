import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "클린 제주 — 제주 클린하우스·재활용도움센터",
		short_name: "클린 제주",
		description: "제주 클린하우스·재활용도움센터 위치와 오늘 배출 가능한 재활용품 안내",
		lang: "ko",
		start_url: "/",
		display: "standalone",
		background_color: "#fafcfb",
		theme_color: "#0d7d5e",
		categories: ["utilities", "lifestyle"],
		icons: [
			{ src: "/icon-192.png", sizes: "192x192", type: "image/png" },
			{ src: "/icon-512.png", sizes: "512x512", type: "image/png" },
			{ src: "/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
			{ src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
		],
	};
}
