import { expect, test } from "@playwright/test";

// US4 — 모바일 반응형 (T023, SC-003)

test.describe("하단 탭 바", () => {
	test("모바일에서 표시되고 탭 이동이 동작한다", async ({ page, isMobile }) => {
		test.skip(!isMobile, "mobile 프로젝트 전용");
		await page.goto("/");
		const nav = page.getByRole("navigation", { name: "하단 메뉴" });
		await expect(nav).toBeVisible();
		await expect(nav.getByRole("link")).toHaveCount(4);
		await nav.getByRole("link", { name: "배출 안내" }).click();
		await expect(page).toHaveURL(/\/guide$/);
		await expect(nav.getByRole("link", { name: "배출 안내" })).toHaveAttribute("aria-current", "page");
	});

	test("데스크톱에서는 숨겨진다", async ({ page, isMobile }) => {
		test.skip(isMobile, "desktop 프로젝트 전용");
		await page.goto("/");
		await expect(page.getByRole("navigation", { name: "하단 메뉴" })).toBeHidden();
	});
});

test.describe("가로 스크롤 금지 (T023)", () => {
	for (const path of ["/", "/guide", "/recycle-center", "/clean-house"]) {
		test(`${path} 에 가로 스크롤 없음`, async ({ page }) => {
			await page.goto(path);
			const overflow = await page.evaluate(
				() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
			);
			expect(overflow).toBeLessThanOrEqual(1);
		});
	}
});

test.describe("바텀시트 (모바일 상세)", () => {
	test("검색 결과 탭 → 시트형 카드 + 44px 터치 타겟", async ({ page, isMobile }) => {
		test.skip(!isMobile, "mobile 프로젝트 전용");
		await page.goto("/");
		await page.getByPlaceholder("명칭·주소·읍면동 검색").fill("한림");
		const first = page.locator("button", { hasText: "클린하우스 ·" }).first();
		await first.click();
		const cta = page.getByRole("link", { name: "카카오맵 길찾기" });
		await expect(cta).toBeVisible();
		const box = await cta.boundingBox();
		expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
	});
});
