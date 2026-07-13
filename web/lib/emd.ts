import { getSites } from "./data";
import type { District, Site } from "./types";

export interface EmdGroup {
	district: District;
	emd: string;
	sites: Site[];
}

/** 클린하우스를 행정시×읍면동으로 그룹핑 — 묶음 페이지 라우팅 근거 (contracts §3) */
export function getEmdGroups(): EmdGroup[] {
	const map = new Map<string, EmdGroup>();
	for (const site of getSites()) {
		if (site.type !== "clean" || !site.emd) continue;
		const key = `${site.district}/${site.emd}`;
		if (!map.has(key)) map.set(key, { district: site.district, emd: site.emd, sites: [] });
		map.get(key)?.sites.push(site);
	}
	return [...map.values()].sort((a, b) => a.district.localeCompare(b.district) || a.emd.localeCompare(b.emd, "ko"));
}

export function getEmdGroup(district: District, emd: string): EmdGroup | undefined {
	return getEmdGroups().find((g) => g.district === district && g.emd === emd);
}
