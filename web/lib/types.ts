// data/*.json 계약 타입 (specs/001 contracts §1, data-model.md)

export type SiteType = "clean" | "recycle";
export type District = "jeju" | "seogwipo";

export interface Site {
	id: string;
	type: SiteType;
	name: string;
	address: string;
	lat: number;
	lng: number;
	district: District;
	emd: string;
	openTime?: string;
	closeTime?: string;
	open24h?: boolean;
	bins?: {
		general?: number;
		recycle?: number;
		glass?: number;
		styrofoam?: number;
		battery?: number;
		lamp?: number;
		food?: number;
		foodMetered?: number;
	};
	cctv?: number;
	services?: {
		smallAppliances: boolean;
		depositRefund: boolean;
		medicine: boolean;
		cookingOil: boolean;
		bottleRefund: boolean;
		pesticide: boolean;
	};
	source: string;
}

export type Item =
	| "general"
	| "food"
	| "plastic"
	| "pet-clear"
	| "paper"
	| "vinyl"
	| "nonflammable"
	| "can-metal"
	| "glass"
	| "styrofoam";

export type Day = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface DisposalRule {
	district: District;
	effectiveFrom: string;
	source: string;
	cleanHouseHours: { start: string; end: string } | null;
	alwaysAllowed: Item[];
	schedule: Record<Day, Item[]>;
	notes: string[];
}

export interface RulesFile {
	verifiedAt: string;
	rules: DisposalRule[];
}

export interface Snapshot {
	collectedAt: string;
	sources: {
		id: string;
		url: string;
		fetchedRows: number;
		acceptedRows: number;
		rejectedRows: number;
		status: "ok" | "failed";
		dataDate?: string;
	}[];
	totalSites: number;
}

/** 지도용 경량 투영 (contracts §2 /api/map-sites) */
export interface MapSite {
	id: string;
	name: string;
	lat: number;
	lng: number;
	type: SiteType;
	district: District;
	emd: string;
	address: string;
	openTime?: string;
	closeTime?: string;
	open24h?: boolean;
}
