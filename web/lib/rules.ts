import type { Day, District, DisposalRule, Item } from "./types";

export const ITEM_LABELS: Record<Item, string> = {
	general: "종량제(일반)",
	food: "음식물",
	plastic: "플라스틱",
	"pet-clear": "투명페트병",
	paper: "종이류",
	vinyl: "비닐류",
	nonflammable: "불연성(마대)",
	"can-metal": "캔·고철",
	glass: "병류",
	styrofoam: "스티로폼",
};

export const DAY_LABELS: Record<Day, string> = {
	mon: "월",
	tue: "화",
	wed: "수",
	thu: "목",
	fri: "금",
	sat: "토",
	sun: "일",
};

const DAY_ORDER: Day[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/** 홈서버 TZ=UTC이므로 반드시 Asia/Seoul로 환산해 요일을 구한다 */
export function todayInSeoul(now: Date = new Date()): { day: Day; dateLabel: string } {
	const fmt = new Intl.DateTimeFormat("ko-KR", {
		timeZone: "Asia/Seoul",
		weekday: "short",
		month: "long",
		day: "numeric",
	});
	const seoulDay = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Seoul", weekday: "short" })
		.format(now)
		.toLowerCase()
		.slice(0, 3) as Day;
	return { day: DAY_ORDER.includes(seoulDay) ? seoulDay : "mon", dateLabel: fmt.format(now) };
}

/** 오늘(또는 지정 요일) 배출 가능한 요일제 품목 */
export function itemsForDay(rule: DisposalRule, day: Day): Item[] {
	return rule.schedule[day] ?? [];
}

export function ruleForDistrict(rules: DisposalRule[], district: District): DisposalRule | undefined {
	return rules.find((r) => r.district === district);
}

export const DISTRICT_LABELS: Record<District, string> = {
	jeju: "제주시",
	seogwipo: "서귀포시",
};
