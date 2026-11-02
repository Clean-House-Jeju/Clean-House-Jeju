import { parse } from "csv-parse/sync";
import iconv from "iconv-lite";

// 실측 검증 완료(2026-11-02): Mozilla/5.0은 물론 이 커스텀 UA로도 페이지 조회 /
// selectFileDataDownload.do POST / fileDownload.do GET 3단계 전부 정상 동작.
// 거부되기 시작하면 Mozilla/5.0 계열로 교체할 것.
const UA = "clean-jeju-pipeline/2.0 (+https://github.com/Clean-House-Jeju/Clean-House-Jeju)";

type FileDownloadInfo = {
	status: boolean;
	error?: string;
	atchFileId?: string;
	fileDetailSn?: string | number;
	dataSetFileDetailInfo?: {
		dataNm?: string;
		publicDataSj?: string;
		publicDataTyDetailCode?: string;
	};
};

/**
 * 데이터셋 상세 HTML에서 publicDataDetailPk(uddi)와 fileDetailSn을 뽑아낸다.
 * data.go.kr이 2026-10월경 다운로드를 2단계 AJAX로 바꾸면서 HTML에서
 * atchFileId=FILE_... 문자열이 사라졌다 — 대신 uddi를 먼저 얻어
 * selectFileDataDownload.do에 물어봐야 atchFileId가 나온다.
 * hidden input과 onclick(fn_fileDataDown) 양쪽을 폴백으로 시도한다.
 */
function extractUddiAndFileDetailSn(datasetId: string, html: string): { uddi: string; fileDetailSn: string } {
	const inputMatch =
		html.match(/id="publicDataDetailPk"[^>]*value="(uddi:[^"]+)"/) ??
		html.match(/value="(uddi:[^"]+)"[^>]*id="publicDataDetailPk"/);
	const onclickMatch = html.match(
		/fn_fileDataDown\('[^']*',\s*'(uddi:[^']+)',\s*'[^']*',\s*'([^']*)'/,
	);

	const uddi = inputMatch?.[1] ?? onclickMatch?.[1];
	if (!uddi) {
		throw new Error(`dataset page ${datasetId}: publicDataDetailPk(uddi) not found (페이지 구조 변경?)`);
	}
	const fileDetailSn = onclickMatch?.[2]?.trim() || "1";
	return { uddi, fileDetailSn };
}

/**
 * data.go.kr 파일데이터 다운로드.
 *
 * 2026-10월경 사이트가 다운로드 흐름을 2단계 AJAX로 바꿔 atchFileId를
 * HTML에 직접 노출하지 않게 되었다. 현재 흐름:
 *   1) 데이터셋 페이지 HTML에서 publicDataDetailPk(uddi) 확보
 *   2) selectFileDataDownload.do에 POST해서 실제 atchFileId 획득
 *   3) fileDownload.do GET으로 CSV 바이너리 다운로드
 * atchFileId는 데이터셋 갱신 시마다 바뀌므로 매 실행 시 1~2단계를 새로 거친다
 * (서비스 키 불필요 경로).
 */
export async function fetchDataGoKrCsv(datasetId: string): Promise<{
	rows: Record<string, string>[];
	pageUrl: string;
	title: string;
}> {
	const pageUrl = `https://www.data.go.kr/data/${datasetId}/fileData.do`;
	const pageRes = await fetch(pageUrl, { headers: { "User-Agent": UA } });
	if (!pageRes.ok) throw new Error(`dataset page ${datasetId}: HTTP ${pageRes.status}`);
	const html = await pageRes.text();
	const title = html.match(/<title>([^<|]+)/)?.[1]?.trim() ?? datasetId;

	const { uddi, fileDetailSn } = extractUddiAndFileDetailSn(datasetId, html);

	const infoRes = await fetch("https://www.data.go.kr/tcs/dss/selectFileDataDownload.do", {
		method: "POST",
		headers: {
			"User-Agent": UA,
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			Referer: pageUrl,
			"X-Requested-With": "XMLHttpRequest",
		},
		body: new URLSearchParams({
			publicDataPk: datasetId,
			publicDataDetailPk: uddi,
			atchFileId: "",
			fileDetailSn,
			publicDataTyCode: "PR0051",
		}).toString(),
	});
	if (!infoRes.ok) {
		throw new Error(`selectFileDataDownload ${datasetId}: HTTP ${infoRes.status} (페이지 구조 변경?)`);
	}
	const info = (await infoRes.json()) as FileDownloadInfo;
	if (!info.status || !info.atchFileId) {
		throw new Error(
			`selectFileDataDownload ${datasetId}: status=false${info.error ? ` (${info.error})` : ""} (페이지 구조 변경?)`,
		);
	}

	const detail = info.dataSetFileDetailInfo;
	const dataNm = (detail?.publicDataTyDetailCode === "DATY05" ? detail?.publicDataSj : detail?.dataNm) ?? "";
	const sn = info.fileDetailSn ?? fileDetailSn;

	const dlUrl = `https://www.data.go.kr/cmm/cmm/fileDownload.do?atchFileId=${encodeURIComponent(
		info.atchFileId,
	)}&fileDetailSn=${encodeURIComponent(String(sn))}&dataNm=${encodeURIComponent(dataNm)}`;
	const dlRes = await fetch(dlUrl, { headers: { "User-Agent": UA, Referer: pageUrl } });
	if (!dlRes.ok) throw new Error(`fileDownload ${datasetId}: HTTP ${dlRes.status}`);
	const buf = Buffer.from(await dlRes.arrayBuffer());

	return { rows: parseCsv(buf), pageUrl, title };
}

/** EUC-KR/UTF-8 자동 감지 후 파싱 */
export function parseCsv(buf: Buffer): Record<string, string>[] {
	let text = buf.toString("utf-8");
	if (text.includes("�")) text = iconv.decode(buf, "euc-kr");
	if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
	return parse(text, {
		columns: (header: string[]) => header.map((h) => h.trim()),
		skip_empty_lines: true,
		trim: true,
		relax_column_count: true,
	});
}
