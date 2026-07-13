"use client";

import { ItemIcon } from "@/components/icons";
import { DISTRICT_LABELS, ITEM_LABELS, itemsForDay, todayInSeoul } from "@/lib/rules";
import type { DisposalRule, Item } from "@/lib/types";
import styles from "./TodayBanner.module.css";

const ALWAYS_ITEMS: Item[] = ["general", "food", "can-metal", "glass", "styrofoam"];

/**
 * 오늘 배출 품목 배너 — 클라이언트에서 재계산해 정적 페이지의 빌드 시점
 * 요일 박제를 방지한다 (레거시 CleanOverlay의 모듈 로드 시 1회 계산 버그 교훈).
 */
export default function TodayBanner({ rules }: { rules: DisposalRule[] }) {
	const { day, dateLabel } = todayInSeoul();

	return (
		<div className={styles.wrap}>
			<span className={styles.today} suppressHydrationWarning>
				{dateLabel}
			</span>
			{rules.map((rule) => {
				const items = itemsForDay(rule, day);
				return (
					<span
						key={rule.district}
						className={styles.districtRow}
						data-district={rule.district}
						suppressHydrationWarning
					>
						<span className={styles.district}>{DISTRICT_LABELS[rule.district]}</span>
						{items.length > 0 ? (
							items.map((i) => (
								<span key={i} className="cj-chip">
									<ItemIcon item={i} /> {ITEM_LABELS[i]}
								</span>
							))
						) : (
							<span className="cj-chip cj-chip--muted">요일제 품목 없음</span>
						)}
					</span>
				);
			})}
			<span className={`cj-chip cj-chip--muted ${styles.always}`}>
				{ALWAYS_ITEMS.map((i) => (
					<span key={i} className={styles.alwaysItem}>
						<ItemIcon item={i} size={13} />
						{ITEM_LABELS[i].replace(/\(.+\)/, "")}
					</span>
				))}
				<span>은 매일</span>
			</span>
		</div>
	);
}
