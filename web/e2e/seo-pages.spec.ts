import { expect, test } from "@playwright/test";

// US3 — SEO 페이지 (FR-013·FR-014): JS 미실행 크롤러 시점 검증

test.describe("JS-off 크롤러 시점 (FR-013)", () => {
	test.use({ javaScriptEnabled: false });

	test("/guide 본문이 HTML에 존재", async ({ page }) => {
		await page.goto("/guide");
		await expect(page.getByRole("heading", { name: "재활용품 요일별 배출제" })).toBeVisible();
		await expect(page.getByText("투명페트병").first()).toBeVisible();
		await expect(page.getByText("매일 배출 가능").first()).toBeVisible();
	});

	test("클린하우스 읍면동 페이지 본문이 HTML에 존재", async ({ page }) => {
		await page.goto("/clean-house");
		await expect(page.getByRole("heading", { name: "클린하우스" })).toBeVisible();
		const firstEmd = page.locator("main a[href*='/clean-house/']").first();
		const href = await firstEmd.getAttribute("href");
		await page.goto(href as string);
		await expect(page.getByRole("heading", { name: /클린하우스/ })).toBeVisible();
		await expect(page.getByText("위치 목록")).toBeVisible();
	});
});

test.describe("메타·구조화 데이터 (FR-014)", () => {
	test("sitemap.xml에 전 콘텐츠 URL 나열", async ({ request }) => {
		const res = await request.get("/sitemap.xml");
		expect(res.ok()).toBeTruthy();
		const xml = await res.text();
		expect(xml).toContain("/guide");
		expect(xml).toContain("/recycle-center/recycle-");
		expect(xml).toContain("/clean-house/");
		expect((xml.match(/<loc>/g) ?? []).length).toBeGreaterThanOrEqual(100);
	});

	test("robots.txt가 sitemap을 가리킨다", async ({ request }) => {
		const txt = await (await request.get("/robots.txt")).text();
		expect(txt).toContain("Sitemap:");
		expect(txt).toContain("/api/");
	});

	test("FAQ 페이지에 FAQPage JSON-LD 존재", async ({ page }) => {
		await page.goto("/guide/faq");
		const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
		expect(JSON.parse(jsonLd as string)["@type"]).toBe("FAQPage");
	});

	test("페이지별 고유 title/description", async ({ page }) => {
		await page.goto("/guide");
		await expect(page).toHaveTitle(/요일별 배출제/);
		const desc = page.locator('meta[name="description"]');
		await expect(desc).toHaveAttribute("content", /제주시·서귀포시/);
	});
});
