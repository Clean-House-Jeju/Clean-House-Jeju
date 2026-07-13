import { type NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { getRules } from "@/lib/data";
import { removeSub, readSubs } from "@/lib/push-store";
import { DISTRICT_LABELS, ITEM_LABELS, itemsForDay, todayInSeoul } from "@/lib/rules";

// 배출 시작 시각(15:00 KST)에 systemd timer가 호출 (deploy/clean-jeju-notify.timer)

export async function POST(req: NextRequest) {
	const token = req.headers.get("x-revalidate-token");
	if (!process.env.REVALIDATE_TOKEN || token !== process.env.REVALIDATE_TOKEN) {
		return NextResponse.json({ error: "unauthorized" }, { status: 401 });
	}
	const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
	const privateKey = process.env.VAPID_PRIVATE_KEY;
	if (!publicKey || !privateKey) {
		return NextResponse.json({ error: "VAPID 미설정" }, { status: 500 });
	}
	webpush.setVapidDetails(process.env.VAPID_SUBJECT ?? "mailto:dndb3599@gmail.com", publicKey, privateKey);

	const { rules } = getRules();
	const { day, dateLabel } = todayInSeoul();
	const lines = rules.map((rule) => {
		const items = itemsForDay(rule, day);
		return `${DISTRICT_LABELS[rule.district]} ${items.length > 0 ? items.map((i) => ITEM_LABELS[i]).join("·") : "요일제 품목 없음"}`;
	});

	const payload = JSON.stringify({
		title: `${dateLabel} 배출 안내`,
		body: lines.join(" / "),
		url: "/",
	});

	const subs = readSubs();
	let sent = 0;
	let pruned = 0;
	await Promise.all(
		subs.map(async (sub) => {
			try {
				await webpush.sendNotification({ endpoint: sub.endpoint, keys: sub.keys }, payload);
				sent++;
			} catch (e) {
				const status = (e as { statusCode?: number }).statusCode;
				if (status === 404 || status === 410) {
					removeSub(sub.endpoint); // 만료 구독 정리
					pruned++;
				}
			}
		}),
	);

	return NextResponse.json({ sent, pruned, total: subs.length });
}
