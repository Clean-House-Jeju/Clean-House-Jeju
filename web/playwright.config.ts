import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	timeout: 30_000,
	retries: 1,
	use: {
		baseURL: "http://localhost:8080",
		locale: "ko-KR",
		timezoneId: "Asia/Seoul",
	},
	projects: [
		{ name: "desktop", use: { ...devices["Desktop Chrome"] } },
		{ name: "mobile", use: { ...devices["iPhone 14"], browserName: "chromium" } },
	],
	webServer: {
		// 카카오 JS 키가 localhost:8080에 등록되어 있어 포트 고정
		command: "pnpm exec next dev -p 8080",
		url: "http://localhost:8080",
		reuseExistingServer: true,
		timeout: 60_000,
	},
});
