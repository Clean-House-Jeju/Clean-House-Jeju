import type { MetadataRoute } from "next";
import { getSites } from "@/lib/data";
import { getEmdGroups } from "@/lib/emd";
import { getWasteGuide } from "@/lib/waste";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:8080";

export default function sitemap(): MetadataRoute.Sitemap {
	const statics: MetadataRoute.Sitemap = ["/", "/guide", "/guide/faq", "/recycle-center", "/clean-house", "/waste", "/privacy"].map(
		(p) => ({ url: `${BASE}${p}`, changeFrequency: "weekly", priority: p === "/" ? 1 : 0.8 }),
	);

	const waste: MetadataRoute.Sitemap = getWasteGuide().entries.map((e) => ({
		url: `${BASE}/waste/${e.slug}`,
		changeFrequency: "monthly" as const,
		priority: 0.7,
	}));

	const centers: MetadataRoute.Sitemap = getSites()
		.filter((s) => s.type === "recycle")
		.map((s) => ({ url: `${BASE}/recycle-center/${s.id}`, changeFrequency: "weekly" as const, priority: 0.6 }));

	const emds: MetadataRoute.Sitemap = getEmdGroups().map((g) => ({
		url: `${BASE}/clean-house/${g.district}/${encodeURIComponent(g.emd)}`,
		changeFrequency: "weekly" as const,
		priority: 0.6,
	}));

	return [...statics, ...waste, ...centers, ...emds];
}
