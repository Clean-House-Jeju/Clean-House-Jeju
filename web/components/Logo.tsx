import styles from "./Logo.module.css";

/** 로고 락업 — 레거시 Clean_house.svg의 오렌지 지붕+민트 몸체 모티프 */
export default function Logo({ size = 26 }: { size?: number }) {
	return (
		<span className={styles.lockup}>
			<svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
				<path d="M16 3 30 15H2Z" fill="var(--cj-accent)" />
				<rect x="6" y="15" width="20" height="13" rx="2.4" fill="var(--cj-clean)" />
				<rect x="13" y="19" width="6" height="9" rx="1.2" fill="#fff" />
				<circle cx="23" cy="20.5" r="2" fill="#fff033" />
			</svg>
			<span className={styles.word}>
				클린 <em>제주</em>
			</span>
		</span>
	);
}
