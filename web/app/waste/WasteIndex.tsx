"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ItemIcon, RecycleNavIcon, SearchIcon } from "@/components/icons";
import { type WasteEntry, WHERE_LABELS } from "@/lib/waste-shared";
import styles from "./page.module.css";

/** 품목 검색 + 카드 그리드 (초기 목록은 SSR로 전달받아 JS 없이도 노출) */
export default function WasteIndex({ entries }: { entries: WasteEntry[] }) {
	const [q, setQ] = useState("");

	const filtered = useMemo(() => {
		const query = q.trim().toLowerCase();
		if (!query) return entries;
		return entries.filter(
			(e) => e.name.toLowerCase().includes(query) || e.aliases.some((a) => a.toLowerCase().includes(query)),
		);
	}, [q, entries]);

	return (
		<>
			<label className={styles.search}>
				<SearchIcon />
				<input
					type="search"
					placeholder="품목 검색 — 예: 건전지, 우유팩, 매트리스"
					aria-label="배출 품목 검색"
					value={q}
					onChange={(e) => setQ(e.target.value)}
				/>
			</label>
			{filtered.length === 0 ? (
				<p className={styles.empty}>
					‘{q}’ 결과가 없어요. <Link href="/report">제보</Link>해 주시면 추가할게요.
				</p>
			) : (
				<ul className={styles.grid}>
					{filtered.map((e) => (
						<li key={e.slug}>
							<Link href={`/waste/${e.slug}`} className={styles.cell}>
								<span className={styles.cellIcon}>
									{e.item ? <ItemIcon item={e.item} size={26} /> : <RecycleNavIcon size={24} />}
								</span>
								<span className={styles.cellName}>{e.name}</span>
								<span className={styles.cellWhere} data-where={e.where}>
									{WHERE_LABELS[e.where]}
								</span>
							</Link>
						</li>
					))}
				</ul>
			)}
		</>
	);
}
