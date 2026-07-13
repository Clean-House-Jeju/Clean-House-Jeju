"use client";

import { Text } from "@astryxdesign/core";
import { DISTRICT_LABELS, ITEM_EMOJI, ITEM_LABELS, itemsForDay, todayInSeoul } from "@/lib/rules";
import type { DisposalRule } from "@/lib/types";
import styles from "./TodayBanner.module.css";

/**
 * 오늘 배출 품목 배너 — 클라이언트에서 재계산해 정적 페이지의 빌드 시점
 * 요일 박제를 방지한다 (레거시 CleanOverlay의 모듈 로드 시 1회 계산 버그 교훈).
 * 서버/클라이언트 자정 경계 차이는 suppressHydrationWarning으로 흡수.
 */
export default function TodayBanner({ rules }: { rules: DisposalRule[] }) {
	const { day, dateLabel } = todayInSeoul();

	return (
		<div className={styles.wrap}>
			<Text weight="medium">
				<span suppressHydrationWarning>{dateLabel}</span> 배출 가능
			</Text>
			{rules.map((rule) => {
				const items = itemsForDay(rule, day);
				return (
					<Text key={rule.district} size="sm">
						<strong>{DISTRICT_LABELS[rule.district]}</strong>{" "}
						<span suppressHydrationWarning>
							{items.length > 0
								? items.map((i) => `${ITEM_EMOJI[i]} ${ITEM_LABELS[i]}`).join(" · ")
								: "요일제 품목 없음"}
						</span>
					</Text>
				);
			})}
			<Text size="sm" color="secondary">
				종량제·음식물·캔·병·스티로폼은 매일 배출 가능 · 재활용도움센터는 요일 무관
			</Text>
		</div>
	);
}
