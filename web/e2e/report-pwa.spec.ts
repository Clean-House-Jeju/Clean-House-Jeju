import { expect, test } from "@playwright/test";

// US5·US6 — 제보 폼 (FR-019) + PWA (FR-022)

test.describe("제보 폼", () => {
	test("작성 → 접수 완료", async ({ page }) => {
		await page.goto("/report");
		await page.locator("textarea").fill("E2E 테스트 제보입니다.");
		await page.getByRole("button", { name: "제보 보내기" }).click();
		await expect(page.getByText("제보가 접수되었습니다")).toBeVisible();
	});

	test("빈 내용은 거부", async ({ page }) => {
		await page.goto("/report");
		await page.getByRole("button", { name: "제보 보내기" }).click();
		await expect(page.getByText("전송하지 못했습니다")).toBeVisible();
	});

	test("honeypot 채우면 조용히 무시(200)", async ({ request }) => {
		const res = await request.post("/api/report", {
			data: { category: "wrong-info", message: "spam", website: "http://bot.example" },
		});
		expect(res.status()).toBe(200);
	});

	test("개소 지정 시 대상 표시", async ({ page, request }) => {
		const { sites } = await (await request.get("/api/map-sites")).json();
		const recycle = sites.find((s: { type: string }) => s.type === "recycle");
		await page.goto(`/report?site=${recycle.id}`);
		await expect(page.getByText("대상 개소:")).toBeVisible();
		await expect(page.getByText(recycle.name).first()).toBeVisible();
	});
});

test.describe("PWA (FR-022)", () => {
	test("manifest가 설치 요건을 갖춘다", async ({ request }) => {
		const res = await request.get("/manifest.webmanifest");
		expect(res.ok()).toBeTruthy();
		const m = await res.json();
		expect(m.display).toBe("standalone");
		expect(m.icons.some((i: { purpose?: string }) => i.purpose === "maskable")).toBeTruthy();
		expect(m.icons.some((i: { sizes: string }) => i.sizes === "512x512")).toBeTruthy();
	});

	test("서비스 워커·오프라인 페이지 서빙", async ({ request }) => {
		const sw = await request.get("/sw.js");
		expect(sw.ok()).toBeTruthy();
		expect(await sw.text()).toContain("cj-v1");
		const offline = await request.get("/offline");
		expect(offline.ok()).toBeTruthy();
		expect(await offline.text()).toContain("오프라인");
	});

	test("서비스 워커가 등록된다", async ({ page, baseURL }) => {
		await page.goto("/");
		const registered = await page.evaluate(async () => {
			if (!("serviceWorker" in navigator)) return false;
			const reg = await navigator.serviceWorker.ready;
			return !!reg.active;
		});
		expect(registered, `SW not registered on ${baseURL}`).toBeTruthy();
	});
});
