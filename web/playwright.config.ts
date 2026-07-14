import { defineConfig, devices } from "@playwright/test";

// T033: PLAYWRIGHT_BASE_URL로 실배포 도메인 대상 E2E 실행 가능
const EXTERNAL = process.env.PLAYWRIGHT_BASE_URL;
// 로컬 DNS 캐시 이슈 우회: PLAYWRIGHT_RESOLVE=<ip> 로 도메인을 직접 매핑
const RESOLVE = process.env.PLAYWRIGHT_RESOLVE;
const resolveArgs =
	EXTERNAL && RESOLVE
		? [`--host-resolver-rules=MAP ${new URL(EXTERNAL).host} ${RESOLVE},MAP www.${new URL(EXTERNAL).host} ${RESOLVE}`]
		: [];

export default defineConfig({
	testDir: "./e2e",
	timeout: 30_000,
	retries: 1,
	use: {
		baseURL: EXTERNAL ?? "http://localhost:8080",
		locale: "ko-KR",
		timezoneId: "Asia/Seoul",
		launchOptions: { args: resolveArgs },
	},
	projects: [
		{ name: "desktop", use: { ...devices["Desktop Chrome"] } },
		{ name: "mobile", use: { ...devices["iPhone 14"], browserName: "chromium" } },
	],
	...(EXTERNAL
		? {}
		: {
				webServer: {
					// 카카오 JS 키가 localhost:8080에 등록되어 있어 포트 고정
					command: "pnpm exec next dev -p 8080",
					url: "http://localhost:8080",
					reuseExistingServer: true,
					timeout: 60_000,
				},
			}),
});
