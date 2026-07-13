"use client";

import { useEffect, useState } from "react";
import { BellIcon } from "@/components/icons";
import styles from "./NotifyBell.module.css";

type State = "unsupported" | "off" | "on" | "busy" | "denied";

function urlBase64ToUint8Array(base64: string): Uint8Array {
	const padding = "=".repeat((4 - (base64.length % 4)) % 4);
	const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
	return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

/** 배출일 푸시 알림 토글 — 매일 15:00(배출 시작)에 오늘 품목 알림 */
export default function NotifyBell() {
	const [state, setState] = useState<State>("unsupported");

	useEffect(() => {
		if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return;
		if (Notification.permission === "denied") {
			setState("denied");
			return;
		}
		navigator.serviceWorker.ready.then(async (reg) => {
			const sub = await reg.pushManager.getSubscription();
			setState(sub ? "on" : "off");
		});
	}, []);

	const toggle = async () => {
		const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
		if (!vapid || state === "busy") return;
		setState("busy");
		try {
			const reg = await navigator.serviceWorker.ready;
			const existing = await reg.pushManager.getSubscription();
			if (existing) {
				await fetch("/api/push/subscribe", {
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ endpoint: existing.endpoint }),
				});
				await existing.unsubscribe();
				setState("off");
				return;
			}
			const permission = await Notification.requestPermission();
			if (permission !== "granted") {
				setState(permission === "denied" ? "denied" : "off");
				return;
			}
			const sub = await reg.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(vapid) as BufferSource,
			});
			const body = sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } };
			await fetch("/api/push/subscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			setState("on");
		} catch {
			setState("off");
		}
	};

	if (state === "unsupported") return null;

	return (
		<button
			type="button"
			className={styles.bell}
			data-on={state === "on"}
			onClick={toggle}
			disabled={state === "busy" || state === "denied"}
			title={
				state === "denied"
					? "브라우저 설정에서 알림 차단을 해제해 주세요"
					: state === "on"
						? "배출일 알림 켜짐 — 탭하여 끄기"
						: "매일 15시에 오늘 배출 품목 알림 받기"
			}
			aria-pressed={state === "on"}
			aria-label="배출일 알림"
		>
			<BellIcon size={15} />
			{state === "on" ? "알림 ON" : "알림"}
		</button>
	);
}
