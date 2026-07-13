import { fetchDataGoKrCsv } from "../fetch-csv.js";
import type { RawSite } from "../schema.js";

export const DATASET_ID = "15045364";
export const SOURCE = `data.go.kr/${DATASET_ID}`;

const yes = (v: string | undefined) => v?.trim() === "가능";

/** 제주도 전체 재활용도움센터 — 운영시간·제공 서비스 포함, 좌표 없음(지오코딩 필요) */
export async function fetchRecycleCenter(): Promise<{ raws: RawSite[]; pageUrl: string; dataDate?: string }> {
	const { rows, pageUrl } = await fetchDataGoKrCsv(DATASET_ID);
	const raws = rows.map((row): RawSite => {
		const address = row["주소"] || "";
		const closeRaw = (row["운영종료시간"] || "").trim();
		return {
			type: "recycle",
			name: `${row["명칭"] || row["읍면동"]} 재활용도움센터`,
			address,
			district: address.includes("서귀포시") ? "seogwipo" : "jeju",
			emd: row["읍면동"] || "",
			openTime: (row["운영시작시간"] || "").trim() || undefined,
			// 23:59는 사실상 자정까지 — 24시간 아님, 표기 유지
			closeTime: closeRaw || undefined,
			services: {
				smallAppliances: yes(row["소형폐가전무상배출"]),
				depositRefund: yes(row["캔_페트_폐건전지_종이팩보상"]),
				medicine: yes(row["가정용폐의약품무상배출"]),
				cookingOil: yes(row["가정용폐식용유무상배출"]),
				bottleRefund: yes(row["빈병 (소주_맥주병) 보증금 환불제"]),
				pesticide: yes(row["폐농약(원액)안심처리"]),
			},
			source: SOURCE,
			raw: row,
		};
	});
	return { raws, pageUrl, dataDate: rows[0]?.["데이터기준일자"] };
}
