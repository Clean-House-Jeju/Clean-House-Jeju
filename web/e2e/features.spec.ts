import { expect, test } from "@playwright/test";

// 추가 기능: 지금 열린 곳 · 즐겨찾기

test.describe("지금 열린 곳", () => {
	test("원탭으로 가장 가까운 운영중 개소 선택", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("button", { name: /지금 열린 곳/ }).click();
		// 열린 곳이 있으면 카드, 없으면(새벽 등) 토스트 — 둘 중 하나는 떠야 한다
		await expect(
			page.getByRole("link", { name: "카카오맵 길찾기" }).or(page.getByText("지금 운영 중인 곳이 없어요")),
		).toBeVisible({ timeout: 10_000 });
	});
});

test.describe("분리배출 품목 사전", () => {
	test("검색 → 상세 이동, 요일 연동 표시", async ({ page }) => {
		await page.goto("/waste");
		await page.getByPlaceholder(/품목 검색/).fill("건전지");
		await page.getByRole("link", { name: /폐건전지/ }).click();
		await expect(page.getByRole("heading", { name: "폐건전지" })).toBeVisible();
		await expect(page.getByText("이렇게 버리세요")).toBeVisible();
	});

	test("JS-off에서도 전체 품목 노출 + HowTo JSON-LD", async ({ browser }) => {
		const ctx = await browser.newContext({ javaScriptEnabled: false });
		const page = await ctx.newPage();
		await page.goto("/waste");
		await expect(page.getByRole("link", { name: /대형폐기물/ })).toBeVisible();
		await page.goto("/waste/plastic");
		await expect(page.getByText("배출 요일")).toBeVisible();
		const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
		expect(JSON.parse(jsonLd as string)["@type"]).toBe("HowTo");
		await ctx.close();
	});
});

test.describe("내 주변", () => {
	test("원탭으로 거리순 리스트가 열리고 선택 가능", async ({ page }) => {
		await page.goto("/");
		await page.getByRole("button", { name: "내 주변" }).click();
		await expect(page.getByText(/내 주변 가까운 순/)).toBeVisible();
		const first = page.locator("button[class*='resultItem']").first();
		await expect(first).toBeVisible();
		await first.click();
		await expect(page.getByRole("link", { name: "카카오맵 길찾기" })).toBeVisible();
		await expect(page.getByText(/내 주변 가까운 순/)).toBeHidden();
	});
});

test.describe("즐겨찾기", () => {
	test("별 토글 → 즐겨찾기 행 노출 → 재방문 시 유지", async ({ page }) => {
		await page.goto("/");
		await page.getByPlaceholder("명칭·주소·읍면동 검색").fill("한림리");
		await page.locator("button[class*='resultItem']").first().click();
		await page.getByRole("button", { name: "즐겨찾기 추가" }).click();
		await expect(page.getByRole("button", { name: "즐겨찾기 해제" })).toBeVisible();
		// 카드 닫으면 즐겨찾기 행이 보인다
		await page.getByRole("button", { name: "닫기" }).click();
		await expect(page.locator("[class*='favPill']").first()).toBeVisible();
		// 새로고침 후에도 유지 (localStorage)
		await page.reload();
		await expect(page.locator("[class*='favPill']").first()).toBeVisible();
	});
});
