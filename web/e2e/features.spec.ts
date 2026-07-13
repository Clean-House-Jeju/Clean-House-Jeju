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
