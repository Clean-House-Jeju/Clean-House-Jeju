import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// 구독 저장소 — 파일 기반 (DB 없음, constitution V). data/push-subs.json은 git 미추적.

const DATA_DIR = process.env.DATA_DIR ?? join(process.cwd(), "..", "data");
const PATH = join(DATA_DIR, "push-subs.json");

export interface PushSub {
	endpoint: string;
	keys: { p256dh: string; auth: string };
	createdAt: string;
}

export function readSubs(): PushSub[] {
	if (!existsSync(PATH)) return [];
	try {
		return JSON.parse(readFileSync(PATH, "utf-8"));
	} catch {
		return [];
	}
}

export function writeSubs(subs: PushSub[]): void {
	const tmp = `${PATH}.tmp`;
	writeFileSync(tmp, JSON.stringify(subs, null, "\t"));
	renameSync(tmp, PATH);
}

export function upsertSub(sub: Omit<PushSub, "createdAt">): void {
	const subs = readSubs().filter((s) => s.endpoint !== sub.endpoint);
	subs.push({ ...sub, createdAt: new Date().toISOString() });
	writeSubs(subs);
}

export function removeSub(endpoint: string): void {
	writeSubs(readSubs().filter((s) => s.endpoint !== endpoint));
}
