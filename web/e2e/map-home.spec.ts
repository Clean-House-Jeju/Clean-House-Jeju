import { expect, test } from "@playwright/test";

// US1 인수 시나리오 (spec.md) — 실데이터 기반 E2E

test.describe("위치 권한 3경로 (FR-007)", () => {
	test("거부 시 5초 내 지도 표시, 무한 로딩 없음", async ({ page, context }) => {
		await context.clearPermissions(); // 권한 프롬프트 → 자동 거부됨(headless)
		await page.goto("/");
		await expect(page.getByRole("application", { name: /지도/ })).toBeVisible({ timeout: 5000 });
		await expect(page.getByText(/클린\s*제주/).first()).toBeVisible();
	});

	test("허용 + 제주 좌표 → 지도 정상 + 외지 배너 없음", async ({ page, context }) => {
		await context.grantPermissions(["geolocation"]);
		await context.setGeolocation({ latitude: 33.4996, longitude: 126.5312 }); // 제주시청
		await page.goto("/");
		await expect(page.getByRole("application", { name: /지도/ })).toBeVisible();
		await expect(page.getByText("제주 외 지역에서 접속 중")).toHaveCount(0);
	});

	test("허용 + 서울 좌표 → 제주 외 지역 안내", async ({ page, context }) => {
		await context.grantPermissions(["geolocation"]);
		await context.setGeolocation({ latitude: 37.5665, longitude: 126.978 });
		await page.goto("/");
		await expect(page.getByText("제주 외 지역에서 접속 중")).toBeVisible({ timeout: 10000 });
	});
});

test.describe("검색 (FR-008)", () => {
	test("'한림' 검색 → 거리순 결과, 클릭 시 상세 카드", async ({ page }) => {
		await page.goto("/");
		await page.getByPlaceholder("명칭·주소·읍면동 검색").fill("한림");
		const first = page.locator("button", { hasText: "클린하우스 ·" }).first();
		await expect(first).toBeVisible({ timeout: 10000 });
		await first.click();
		await expect(page.getByRole("link", { name: "카카오맵 길찾기" })).toBeVisible();
	});

	test("결과 없음 → 빈 상태 UI (alert 아님)", async ({ page }) => {
		await page.goto("/");
		await page.getByPlaceholder("명칭·주소·읍면동 검색").fill("존재하지않는곳zzz");
		await expect(page.getByText("검색 결과가 없습니다")).toBeVisible();
	});
});

test.describe("오늘 배출 품목 배너", () => {
	test("두 행정시 규칙이 칩으로 표시된다", async ({ page }) => {
		await page.goto("/");
		await expect(page.getByText("제주시", { exact: true })).toBeVisible();
		await expect(page.getByText("서귀포시", { exact: true })).toBeVisible();
		// 요일제 품목 칩 (요일제 품목이 없는 요일이면 대체 문구)
		await expect(page.locator(".cj-chip").first()).toBeVisible();
		await expect(page.getByText(/스티로폼은 매일/)).toBeVisible();
	});
});
