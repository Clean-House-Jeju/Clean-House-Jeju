import styles from "./Logo.module.css";

/**
 * 클린 제주 마크 — 단일 컨셉: 감귤 단면(제주) × 순환(재활용).
 * 세그먼트 3개(120° 간격), 상단 감귤빛 포인트. brand/logo.svg와 동일 기하.
 */
export function LogoMark({ size = 26 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
			<path
				d="M 19.50 19.05 A 18 18 0 0 1 44.50 19.05"
				fill="none"
				stroke="var(--cj-accent, #f2871e)"
				strokeWidth="9.5"
				strokeLinecap="round"
			/>
			<path
				d="M 27.31 49.30 A 18 18 0 0 1 14.53 27.65"
				fill="none"
				stroke="var(--cj-clean, #12a37a)"
				strokeWidth="9.5"
				strokeLinecap="round"
			/>
			<path
				d="M 49.47 27.65 A 18 18 0 0 1 36.96 49.30"
				fill="none"
				stroke="var(--cj-clean, #12a37a)"
				strokeWidth="9.5"
				strokeLinecap="round"
			/>
			<circle cx="32" cy="32" r="3" fill="var(--cj-clean-deep, #0d7d5e)" />
		</svg>
	);
}

export default function Logo({ size = 26 }: { size?: number }) {
	return (
		<span className={styles.lockup}>
			<LogoMark size={size} />
			<span className={styles.word}>
				클린<em>제주</em>
			</span>
		</span>
	);
}
