"use client";

import { ItemIcon } from "@/components/icons";
import { DISTRICT_LABELS, ITEM_LABELS, itemsForDay, todayInSeoul } from "@/lib/rules";
import type { DisposalRule, Item } from "@/lib/types";
import styles from "./TodayBanner.module.css";

const ALWAYS_ITEMS: Item[] = ["general", "food", "can-metal", "glass", "styrofoam"];

/**
 * 오늘 배출 바 — 지도 하단에 상시 고정 (스크롤 칩에 묻히지 않게).
 * 클라이언트에서 재계산해 정적 페이지의 빌드 시점 요일 박제를 방지한다.
 */
export default function TodayBanner({ rules, asOf }: { rules: DisposalRule[]; asOf?: string }) {
	const { day, dateLabel } = todayInSeoul();

	return (
		<section className={styles.bar} aria-label="오늘 배출 가능 품목">
			<header className={styles.head}>
				<span className={styles.today} suppressHydrationWarning>
					{dateLabel} 배출
				</span>
				{asOf && <span className={styles.asOf}>데이터 기준일 {asOf}</span>}
			</header>
			<div className={styles.rows} suppressHydrationWarning>
				{rules.map((rule) => {
					const items = itemsForDay(rule, day);
					return (
						<div key={rule.district} className={styles.districtRow} data-district={rule.district}>
							<span className={styles.district}>{DISTRICT_LABELS[rule.district]}</span>
							<span className={styles.items}>
								{items.length > 0 ? (
									items.map((i) => (
										<span key={i} className={`cj-chip ${styles.chip}`}>
											<ItemIcon item={i} /> {ITEM_LABELS[i]}
										</span>
									))
								) : (
									<span className={`cj-chip cj-chip--muted ${styles.chip}`}>요일제 품목 없음</span>
								)}
							</span>
						</div>
					);
				})}
			</div>
			<p className={styles.always}>
				{ALWAYS_ITEMS.map((i) => (
					<span key={i} className={styles.alwaysItem}>
						<ItemIcon item={i} size={12} />
						{ITEM_LABELS[i].replace(/\(.+\)/, "")}
					</span>
				))}
				<span>은 매일 배출 가능</span>
			</p>
		</section>
	);
}
