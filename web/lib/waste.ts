import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { WasteEntry } from "./waste-shared";

export type { WasteEntry, WasteWhere } from "./waste-shared";
export { SERVICE_LABELS, WHERE_LABELS } from "./waste-shared";

const DATA_DIR = process.env.DATA_DIR ?? join(process.cwd(), "..", "data");

export interface WasteGuide {
	verifiedAt: string;
	sources: string[];
	entries: WasteEntry[];
}

let cache: WasteGuide | null = null;

export function getWasteGuide(): WasteGuide {
	cache ??= JSON.parse(readFileSync(join(DATA_DIR, "waste-guide.json"), "utf-8")) as WasteGuide;
	return cache;
}

export function getWasteEntry(slug: string): WasteEntry | undefined {
	return getWasteGuide().entries.find((e) => e.slug === slug);
}
