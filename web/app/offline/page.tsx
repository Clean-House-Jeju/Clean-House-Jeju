import type { Metadata } from "next";
import Logo from "@/components/Logo";
import styles from "./page.module.css";

export const metadata: Metadata = {
	title: "오프라인",
	robots: { index: false },
};

export default function OfflinePage() {
	return (
		<main className={styles.main}>
			<Logo size={40} />
			<h1>지금은 오프라인이에요</h1>
			<p>
				네트워크에 다시 연결되면 최신 정보를 불러올 수 있습니다.
				<br />
				재활용도움센터는 요일 구분 없이 이용할 수 있다는 점, 기억해 주세요.
			</p>
		</main>
	);
}
