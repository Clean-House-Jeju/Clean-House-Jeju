"use client";

import { useEffect, useState } from "react";
import styles from "./PwaSetup.module.css";

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const VISIT_KEY = "cj-visits";
const DISMISS_KEY = "cj-install-dismissed";

/** SW 등록 + 재방문 사용자 설치 유도 (FR-022) */
export default function PwaSetup() {
	const [installEvt, setInstallEvt] = useState<BeforeInstallPromptEvent | null>(null);
	const [show, setShow] = useState(false);

	useEffect(() => {
		// dev에서도 등록 — sw.js가 localhost에서는 캐시를 끄고 푸시만 처리한다
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.register("/sw.js").catch(() => {});
		}
		const visits = Number(localStorage.getItem(VISIT_KEY) ?? 0) + 1;
		localStorage.setItem(VISIT_KEY, String(visits));

		const onPrompt = (e: Event) => {
			e.preventDefault();
			if (visits >= 2 && !localStorage.getItem(DISMISS_KEY)) {
				setInstallEvt(e as BeforeInstallPromptEvent);
				setShow(true);
			}
		};
		window.addEventListener("beforeinstallprompt", onPrompt);
		window.addEventListener("appinstalled", () => setShow(false));
		return () => window.removeEventListener("beforeinstallprompt", onPrompt);
	}, []);

	if (!show || !installEvt) return null;

	return (
		<div className={styles.banner} role="dialog" aria-label="앱 설치 안내">
			<p className={styles.text}>
				<strong>클린 제주</strong>를 홈 화면에 설치하면 배출일마다 바로 열 수 있어요
			</p>
			<div className={styles.actions}>
				<button
					type="button"
					className={styles.install}
					onClick={async () => {
						await installEvt.prompt();
						setShow(false);
					}}
				>
					설치
				</button>
				<button
					type="button"
					className={styles.later}
					onClick={() => {
						localStorage.setItem(DISMISS_KEY, "1");
						setShow(false);
					}}
				>
					나중에
				</button>
			</div>
		</div>
	);
}
