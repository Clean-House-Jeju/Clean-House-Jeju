"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GuideNavIcon, HouseNavIcon, MapNavIcon, RecycleNavIcon } from "./icons";
import styles from "./BottomNav.module.css";

const TABS = [
	{ href: "/", label: "지도", Icon: MapNavIcon },
	{ href: "/guide", label: "배출 안내", Icon: GuideNavIcon },
	{ href: "/recycle-center", label: "도움센터", Icon: RecycleNavIcon },
	{ href: "/clean-house", label: "클린하우스", Icon: HouseNavIcon },
] as const;

/** 모바일 하단 탭 바 — 768px 미만에서만 표시 (PWA/TWA 앱 관행) */
export default function BottomNav() {
	const pathname = usePathname();

	return (
		<nav className={styles.nav} aria-label="하단 메뉴">
			{TABS.map(({ href, label, Icon }) => {
				const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
				return (
					<Link key={href} href={href} className={styles.tab} data-active={active} aria-current={active ? "page" : undefined}>
						<Icon />
						<span>{label}</span>
					</Link>
				);
			})}
		</nav>
	);
}
