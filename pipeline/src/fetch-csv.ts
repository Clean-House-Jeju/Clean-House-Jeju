import { parse } from "csv-parse/sync";
import iconv from "iconv-lite";

const UA = "clean-jeju-pipeline/2.0 (+https://github.com/Clean-House-Jeju/Clean-House-Jeju)";

/**
 * data.go.kr 파일데이터 다운로드. atchFileId는 데이터셋 갱신 시 바뀌므로
 * 매 실행마다 데이터셋 페이지에서 현재 값을 파싱한다 (서비스 키 불필요 경로).
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

	const atchMatch = html.match(/atchFileId=(FILE_[0-9]+)/);
	if (!atchMatch) throw new Error(`dataset page ${datasetId}: atchFileId not found (페이지 구조 변경?)`);
	const title = html.match(/<title>([^<|]+)/)?.[1]?.trim() ?? datasetId;

	const dlUrl = `https://www.data.go.kr/cmm/cmm/fileDownload.do?atchFileId=${atchMatch[1]}&fileDetailSn=1`;
	const dlRes = await fetch(dlUrl, { headers: { "User-Agent": UA } });
	if (!dlRes.ok) throw new Error(`download ${datasetId}: HTTP ${dlRes.status}`);
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
