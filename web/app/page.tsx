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
			<h1 className={styles.srOnly}>클린 제주 — 제주 클린하우스·재활용도움센터 지도</h1>
			<MapView rules={rules} asOf={asOf} />
		</div>
	);
}
