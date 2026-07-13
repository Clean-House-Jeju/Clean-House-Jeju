import styles from "./Logo.module.css";

/**
 * 클린 제주 로고 — 레거시 팔레트(민트 하우스·오렌지 지붕·옐로 포인트)를 참고한 리디자인.
 * 모티프: 감귤빛 지붕 + 새싹 굴뚝(청정) + 바디의 물결(제주 바다) + 둥근 창(감귤).
 */
export function LogoMark({ size = 28 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
			<defs>
				<linearGradient id="cj-roof" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#ffb254" />
					<stop offset="1" stopColor="#f2871e" />
				</linearGradient>
				<linearGradient id="cj-body" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#2ebd93" />
					<stop offset="1" stopColor="#0d7d5e" />
				</linearGradient>
				<clipPath id="cj-clip">
					<rect x="10" y="27" width="44" height="30" rx="7" />
				</clipPath>
			</defs>

			{/* 굴뚝 + 새싹 (청정 모티프) */}
			<rect x="44" y="9" width="7" height="14" rx="2.2" fill="#d96f14" />
			<path d="M47.5 9.5C47 6.6 48.4 4.4 51.2 3.6c.4 2.9-.9 5-3.7 5.9Z" fill="#57b26b" />
			<path d="M47.5 9.5c-2.8-.3-4.5-1.9-4.9-4.6 2.8.2 4.5 1.8 4.9 4.6Z" fill="#3f9655" />

			{/* 지붕 */}
			<path
				d="M30.1 7.6a3.2 3.2 0 0 1 3.8 0l24.6 18c1.7 1.2.8 3.9-1.3 3.9H6.8c-2.1 0-3-2.7-1.3-3.9Z"
				fill="url(#cj-roof)"
			/>

			{/* 바디 */}
			<rect x="10" y="27" width="44" height="30" rx="7" fill="url(#cj-body)" />

			{/* 물결 (제주 바다) */}
			<g clipPath="url(#cj-clip)">
				<path
					d="M8 47.5c3.7-2.6 7.3-2.6 11 0s7.3 2.6 11 0 7.3-2.6 11 0 7.3 2.6 11 0V59H8Z"
					fill="#ffffff"
					opacity="0.13"
				/>
				<path
					d="M8 51c3.7-2.6 7.3-2.6 11 0s7.3 2.6 11 0 7.3-2.6 11 0 7.3 2.6 11 0V59H8Z"
					fill="#ffffff"
					opacity="0.1"
				/>
			</g>

			{/* 문 (아치) */}
			<path d="M26.4 57V44.8a5.6 5.6 0 0 1 11.2 0V57Z" fill="#ffffff" />
			<circle cx="34.6" cy="49.6" r="1.3" fill="#0d7d5e" />

			{/* 둥근 창 (감귤빛 포인트 — 레거시 #fff033 계승) */}
			<circle cx="45.5" cy="36.5" r="3.6" fill="#fff033" />
			<circle cx="45.5" cy="36.5" r="3.6" fill="none" stroke="#e8c400" strokeWidth="1" opacity="0.6" />
		</svg>
	);
}

export default function Logo({ size = 28 }: { size?: number }) {
	return (
		<span className={styles.lockup}>
			<LogoMark size={size} />
			<span className={styles.word}>
				클린<em>제주</em>
			</span>
		</span>
	);
}
