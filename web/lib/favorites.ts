"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "cj-favorites";

function read(): string[] {
	try {
		return JSON.parse(localStorage.getItem(KEY) ?? "[]");
	} catch {
		return [];
	}
}

/** 즐겨찾기 개소 id 목록 — localStorage 영속 */
export function useFavorites() {
	const [ids, setIds] = useState<string[]>([]);

	useEffect(() => {
		setIds(read());
	}, []);

	const toggle = useCallback((id: string) => {
		setIds((prev) => {
			const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
			localStorage.setItem(KEY, JSON.stringify(next));
			return next;
		});
	}, []);

	const has = useCallback((id: string) => ids.includes(id), [ids]);

	return { ids, toggle, has };
}
