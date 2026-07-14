import { NextResponse } from "next/server";
import { getRules } from "@/lib/data";
import { DAY_LABELS, DISTRICT_LABELS, ITEM_LABELS, itemsForDay } from "@/lib/rules";
import type { Day } from "@/lib/types";

// iOS 앱 로컬 알림용 주간 스케줄 (T040) — 배출제는 고정 주간 로테이션이라
// 서버 푸시 대신 기기 로컬 예약 알림으로 충분. 앱이 실행 시마다 이걸 받아 재예약한다.

export const revalidate = 3600;

// iOS 캘린더 weekday: 1=일 … 7=토
const DAYS: Day[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export async function GET() {
	const { rules, verifiedAt } = getRules();
	const days = DAYS.map((day, i) => ({
		weekday: i + 1,
		title: `${DAY_LABELS[day]}요일 배출 안내`,
		body: rules
			.map((rule) => {
				const items = itemsForDay(rule, day);
				return `${DISTRICT_LABELS[rule.district]} ${items.length > 0 ? items.map((it) => ITEM_LABELS[it]).join("·") : "요일제 품목 없음"}`;
			})
			.join(" / "),
	}));
	// 15:00 = 제주시 배출 시작 시각 (web push의 notify.timer와 동일)
	return NextResponse.json({ hour: 15, minute: 0, days, verifiedAt });
}
