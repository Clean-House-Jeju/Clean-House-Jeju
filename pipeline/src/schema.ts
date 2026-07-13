import { z } from "zod";

// 제주 경계 bbox — 레거시(33.19~33.56)는 추자면·마라도·가파도를 누락했음.
// 마라도 33.11 / 가파도 33.16 / 추자도 ~33.97 / 우도 126.97 포함하도록 확장.
export const JEJU_BBOX = {
	latMin: 33.05,
	latMax: 34.05,
	lngMin: 125.9,
	lngMax: 127.1,
} as const;

export const SiteSchema = z.object({
	id: z.string().regex(/^(clean|recycle)-[a-z0-9]{10}$/),
	type: z.enum(["clean", "recycle"]),
	name: z.string().min(1),
	address: z.string().min(1),
	lat: z.number().min(JEJU_BBOX.latMin).max(JEJU_BBOX.latMax),
	lng: z.number().min(JEJU_BBOX.lngMin).max(JEJU_BBOX.lngMax),
	district: z.enum(["jeju", "seogwipo"]),
	emd: z.string().min(1),
	openTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
	closeTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
	open24h: z.boolean().optional(),
	bins: z
		.object({
			general: z.number().int().nonnegative().optional(),
			recycle: z.number().int().nonnegative().optional(),
			glass: z.number().int().nonnegative().optional(),
			styrofoam: z.number().int().nonnegative().optional(),
			battery: z.number().int().nonnegative().optional(),
			lamp: z.number().int().nonnegative().optional(),
			food: z.number().int().nonnegative().optional(),
			foodMetered: z.number().int().nonnegative().optional(),
		})
		.optional(),
	cctv: z.number().int().nonnegative().optional(),
	services: z
		.object({
			smallAppliances: z.boolean(),
			depositRefund: z.boolean(),
			medicine: z.boolean(),
			cookingOil: z.boolean(),
			bottleRefund: z.boolean(),
			pesticide: z.boolean(),
		})
		.optional(),
	source: z.string().min(1),
});

export type Site = z.infer<typeof SiteSchema>;

export const SnapshotSchema = z.object({
	collectedAt: z.string(),
	sources: z.array(
		z.object({
			id: z.string(),
			url: z.string(),
			fetchedRows: z.number().int(),
			acceptedRows: z.number().int(),
			rejectedRows: z.number().int(),
			status: z.enum(["ok", "failed"]),
			dataDate: z.string().optional(),
		}),
	),
	totalSites: z.number().int(),
});

export type Snapshot = z.infer<typeof SnapshotSchema>;

export interface Reject {
	source: string;
	reason: string;
	row: Record<string, string>;
}

export interface RawSite {
	type: "clean" | "recycle";
	name: string;
	address: string;
	lat?: number;
	lng?: number;
	district: "jeju" | "seogwipo";
	emd: string;
	openTime?: string;
	closeTime?: string;
	bins?: Site["bins"];
	cctv?: number;
	services?: Site["services"];
	source: string;
	raw: Record<string, string>;
}
