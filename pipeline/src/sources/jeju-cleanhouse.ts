import { fetchDataGoKrCsv } from "../fetch-csv.js";
import type { RawSite } from "../schema.js";

export const DATASET_ID = "15110514";
export const SOURCE = `data.go.kr/${DATASET_ID}`;

const num = (v: string | undefined) => {
	const n = Number(v);
	return Number.isFinite(n) ? n : undefined;
};

/** 제주시 클린하우스 — 좌표·수거함 구성 포함 */
export async function fetchJejuCleanhouse(): Promise<{ raws: RawSite[]; pageUrl: string; dataDate?: string }> {
	const { rows, pageUrl } = await fetchDataGoKrCsv(DATASET_ID);
	const raws = rows.map((row): RawSite => ({
		type: "clean",
		name: row["단지 명"] || row["단지명"] || "클린하우스",
		address: row["도로명 주소"] || row["도로명주소"] || "",
		lat: num(row["위도 좌표"] || row["위도"]),
		lng: num(row["경도 좌표"] || row["경도"]),
		district: "jeju",
		emd: row["읍면동 명"] || row["읍면동"] || "",
		// 클린하우스 배출시간은 rules.json(제주시 15:00~04:00)이 규정 — 개소 데이터에는 없음
		bins: {
			general: num(row["종량제 수거함 수"]),
			recycle: num(row["재활용 수거함 수"]),
			glass: num(row["유리병 수거함 수"]),
			styrofoam: num(row["스티로폼 수거함 수"]),
			battery: num(row["폐기 건전지 수거함 수"]),
			lamp: num(row["폐기 형광등 수거함 수"]),
			food: num(row["음식물 수거함 수"]),
			foodMetered: num(row["음식물 계량 수거함 수"]),
		},
		cctv: num(row["CCTV 설치 수"]),
		source: SOURCE,
		raw: row,
	}));
	return { raws, pageUrl, dataDate: rows[0]?.["등록 일시"] };
}
