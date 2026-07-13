import { Text } from "@astryxdesign/core";
import Link from "next/link";
import TodayBanner from "@/components/home/TodayBanner";
import MapView from "@/components/map/MapView";
import { getDataAsOf, getRules } from "@/lib/data";
import styles from "./page.module.css";

// 데이터 파일은 revalidate API가 무효화하지만, 요일 경계 대비 시간 단위 재생성도 걸어둔다
export const revalidate = 3600;

export default function Home() {
	const { rules } = getRules();
	const asOf = getDataAsOf();

	return (
		<div className={styles.page}>
			<header className={styles.header}>
				<div className={styles.titleRow}>
					<h1 className={styles.title}>클린 제주</h1>
					<nav className={styles.nav} aria-label="주 메뉴">
						<Link href="/guide">배출 안내</Link>
						<Link href="/recycle-center">재활용도움센터</Link>
						<Link href="/clean-house">클린하우스</Link>
					</nav>
					<Text size="sm" color="secondary">
						데이터 기준일 {asOf}
					</Text>
				</div>
				<TodayBanner rules={rules} />
			</header>
			<MapView />
		</div>
	);
}
