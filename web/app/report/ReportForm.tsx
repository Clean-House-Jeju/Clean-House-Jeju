"use client";

import { Banner, Button, SegmentedControl, SegmentedControlItem, TextInput } from "@astryxdesign/core";
import { useState } from "react";
import styles from "./page.module.css";

const CATEGORY_LABELS: Record<string, string> = {
	"wrong-info": "정보가 달라요",
	closed: "없어졌어요",
	suggestion: "제안·기타",
};

export default function ReportForm({ siteId, siteName }: { siteId?: string; siteName?: string }) {
	const [category, setCategory] = useState("wrong-info");
	const [message, setMessage] = useState("");
	const [contact, setContact] = useState("");
	const [website, setWebsite] = useState(""); // honeypot
	const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
	const [errorMsg, setErrorMsg] = useState("");

	const submit = async () => {
		if (!message.trim()) {
			setErrorMsg("내용을 입력해 주세요.");
			setState("error");
			return;
		}
		setState("sending");
		try {
			const res = await fetch("/api/report", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ siteId, category, message, contact, website }),
			});
			if (!res.ok) {
				const body = (await res.json().catch(() => ({}))) as { error?: string };
				throw new Error(body.error ?? `HTTP ${res.status}`);
			}
			setState("done");
		} catch (e) {
			setErrorMsg((e as Error).message);
			setState("error");
		}
	};

	if (state === "done") {
		return <Banner status="success" title="제보가 접수되었습니다" description="확인 후 데이터에 반영하겠습니다. 감사합니다!" />;
	}

	return (
		<div className={styles.form}>
			{siteName && <p className={styles.target}>대상 개소: <strong>{siteName}</strong></p>}
			<SegmentedControl label="제보 분류" value={category} onChange={setCategory}>
				{Object.entries(CATEGORY_LABELS).map(([v, l]) => (
					<SegmentedControlItem key={v} value={v} label={l} />
				))}
			</SegmentedControl>
			<label className={styles.field}>
				<span className={styles.label}>내용 *</span>
				<textarea
					className={styles.textarea}
					rows={6}
					maxLength={2000}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="어떤 정보가 어떻게 다른지 알려주세요. 위치 설명이 구체적일수록 빨리 반영할 수 있어요."
				/>
			</label>
			<TextInput
				label="회신 받을 연락처 (선택)"
				value={contact}
				onChange={setContact}
				placeholder="이메일 등 (선택)"
			/>
			{/* honeypot — 사람에게는 보이지 않음 */}
			<input
				type="text"
				name="website"
				value={website}
				onChange={(e) => setWebsite(e.target.value)}
				className={styles.hp}
				tabIndex={-1}
				autoComplete="off"
				aria-hidden="true"
			/>
			{state === "error" && <Banner status="error" title="전송하지 못했습니다" description={errorMsg} />}
			<Button label={state === "sending" ? "전송 중…" : "제보 보내기"} clickAction={submit} isDisabled={state === "sending"} />
		</div>
	);
}
