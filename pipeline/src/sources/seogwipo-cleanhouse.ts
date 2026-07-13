import { fetchDataGoKrCsv } from "../fetch-csv.js";
import type { RawSite } from "../schema.js";

export const DATASET_ID = "15056472";
export const SOURCE = `data.go.kr/${DATASET_ID}`;

/** 서귀포시 클린하우스 — 좌표 없음(지오코딩 필요), 명칭=위치 설명 */
export async function fetchSeogwipoCleanhouse(): Promise<{ raws: RawSite[]; pageUrl: string; dataDate?: string }> {
	const { rows, pageUrl } = await fetchDataGoKrCsv(DATASET_ID);
	const raws = rows.map((row): RawSite => ({
		type: "clean",
		name: row["위치"] || "클린하우스",
		address: row["인근주소"] || "",
		district: "seogwipo",
		emd: row["읍면동"] || "",
		source: SOURCE,
		raw: row,
	}));
	return { raws, pageUrl, dataDate: rows[0]?.["데이터기준일자"] };
}
