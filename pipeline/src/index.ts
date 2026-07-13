import { mkdirSync, renameSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { geocodeAll, loadGeocache, saveGeocache } from "./geocode.js";
import { normalize } from "./normalize.js";
import { sendFailureEmail, summarize } from "./report.js";
import type { RawSite, Reject, Snapshot } from "./schema.js";
import { SnapshotSchema } from "./schema.js";
import { fetchJejuCleanhouse, SOURCE as SRC_JEJU } from "./sources/jeju-cleanhouse.js";
import { fetchRecycleCenter, SOURCE as SRC_RECYCLE } from "./sources/recycle-center.js";
import { fetchSeogwipoCleanhouse, SOURCE as SRC_SEOGWIPO } from "./sources/seogwipo-cleanhouse.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const DATA_DIR = process.env.DATA_DIR ?? join(ROOT, "data");
const GEOCACHE_PATH = join(DATA_DIR, "geocache.json");

function writeAtomic(path: string, content: string): void {
	const tmp = `${path}.tmp`;
	writeFileSync(tmp, content);
	renameSync(tmp, path);
}

async function main(): Promise<void> {
	mkdirSync(join(DATA_DIR, "rejects"), { recursive: true });
	const collectedAt = new Date().toISOString();
	const restKey = process.env.KAKAO_REST_KEY;

	const sourceDefs = [
		{ id: SRC_JEJU, fetch: fetchJejuCleanhouse },
		{ id: SRC_SEOGWIPO, fetch: fetchSeogwipoCleanhouse },
		{ id: SRC_RECYCLE, fetch: fetchRecycleCenter },
	];

	const raws: RawSite[] = [];
	const sourceMeta: Snapshot["sources"] = [];
	const failures: string[] = [];

	for (const def of sourceDefs) {
		try {
			const { raws: r, pageUrl, dataDate } = await def.fetch();
			if (r.length === 0) throw new Error("0 rows");
			raws.push(...r);
			sourceMeta.push({
				id: def.id, url: pageUrl,
				fetchedRows: r.length, acceptedRows: 0, rejectedRows: 0,
				status: "ok", ...(dataDate ? { dataDate } : {}),
			});
			console.log(`[collect] ${def.id}: ${r.length} rows`);
		} catch (e) {
			failures.push(`${def.id}: ${(e as Error).message}`);
			sourceMeta.push({ id: def.id, url: "", fetchedRows: 0, acceptedRows: 0, rejectedRows: 0, status: "failed" });
		}
	}

	// FR-004: 소스 실패 시 기존 데이터 보존 — 전체 중단
	if (failures.length > 0) {
		const msg = `수집 실패 — 기존 데이터 유지:\n${failures.join("\n")}`;
		console.error(`[collect] ${msg}`);
		await sendFailureEmail("[clean-jeju] 데이터 수집 실패", msg);
		process.exit(1);
	}

	// 좌표 없는 행 지오코딩 (캐시 우선)
	const geocache = loadGeocache(GEOCACHE_PATH);
	const needGeo = raws.filter((r) => r.lat === undefined || r.lng === undefined);
	const { resolved, misses } = await geocodeAll(needGeo.map((r) => r.address), geocache, restKey);
	for (const r of needGeo) {
		const hit = resolved.get(r.address);
		if (hit) { r.lat = hit.lat; r.lng = hit.lng; }
	}
	saveGeocache(GEOCACHE_PATH, geocache);
	if (misses.length > 0) {
		console.warn(`[geocode] 미해석 주소 ${misses.length}건${restKey ? "" : " (KAKAO_REST_KEY 미설정)"}`);
	}

	const { sites, rejects } = normalize(raws);

	// 소스별 accepted/rejected 집계
	for (const meta of sourceMeta) {
		meta.acceptedRows = sites.filter((s) => s.source === meta.id).length;
		meta.rejectedRows = rejects.filter((r) => r.source === meta.id).length;
	}

	const snapshot = SnapshotSchema.parse({
		collectedAt,
		sources: sourceMeta,
		totalSites: sites.length,
	} satisfies Snapshot);

	// 산출물 자체 검증 후 원자적 기록 (contracts §1)
	writeAtomic(join(DATA_DIR, "sites.json"), `${JSON.stringify(sites, null, "\t")}\n`);
	writeAtomic(join(DATA_DIR, "snapshot.json"), `${JSON.stringify(snapshot, null, "\t")}\n`);
	if (rejects.length > 0) {
		const rejectPath = join(DATA_DIR, "rejects", `${collectedAt.replace(/[:.]/g, "-")}.json`);
		writeFileSync(rejectPath, `${JSON.stringify(rejects satisfies Reject[], null, "\t")}\n`);
	}

	console.log(summarize(snapshot));

	// on-demand revalidate (배포 환경에서만 설정됨)
	const revalidateUrl = process.env.REVALIDATE_URL;
	const revalidateToken = process.env.REVALIDATE_TOKEN;
	if (revalidateUrl && revalidateToken) {
		const res = await fetch(revalidateUrl, {
			method: "POST",
			headers: { "x-revalidate-token": revalidateToken },
		});
		console.log(`[revalidate] ${revalidateUrl}: HTTP ${res.status}`);
	}
}

main().catch(async (e) => {
	console.error(e);
	await sendFailureEmail("[clean-jeju] 파이프라인 오류", String(e?.stack ?? e));
	process.exit(1);
});
