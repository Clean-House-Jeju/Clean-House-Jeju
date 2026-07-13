import Link from "next/link";
import Logo from "./Logo";
import styles from "./SiteHeader.module.css";

/** 콘텐츠 페이지 공통 헤더 — 홈(지도)은 자체 컴팩트 헤더 사용 */
export default function SiteHeader() {
	return (
		<header className={styles.header}>
			<Link href="/" className={styles.logo}>
				<Logo />
			</Link>
			<nav className={styles.nav} aria-label="주 메뉴">
				<Link href="/">지도</Link>
				<Link href="/guide">배출 안내</Link>
				<Link href="/waste">품목 사전</Link>
				<Link href="/recycle-center">재활용도움센터</Link>
				<Link href="/clean-house">클린하우스</Link>
			</nav>
		</header>
	);
}
