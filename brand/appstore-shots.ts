/**
 * App Store 6.7" 스크린샷 생성 (1290×2796)
 * 실행: 웹 dev 서버(:8080) 켠 상태에서 `pnpm exec tsx brand/appstore-shots.ts`
 * 산출: brand/screenshots/raw/*.png (원본) + brand/screenshots/framed/*.png (스토어 제출용)
 */
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
// playwright는 web 패키지 의존성 — 루트에서 실행하므로 web 기준으로 해석
const requireWeb = createRequire(join(ROOT, "web/package.json"));
const { chromium } = requireWeb("@playwright/test") as typeof import("@playwright/test");
type Page = import("@playwright/test").Page;
const RAW = join(ROOT, "brand/screenshots/raw");
const FRAMED = join(ROOT, "brand/screenshots/framed");
const BASE = process.env.SHOT_BASE_URL ?? "http://localhost:8080";

const W = 1290;
const H = 2796;

interface Shot {
	name: string;
	headline: string;
	sub: string;
	capture: (page: Page) => Promise<void>;
}

const SHOTS: Shot[] = [
	{
		name: "01-map",
		headline: "오늘 뭘 버릴 수 있는지",
		sub: "3초면 확인",
		capture: async (page) => {
			await page.goto(`${BASE}/`);
			await page.waitForTimeout(3500); // 지도 타일 로드
		},
	},
	{
		name: "02-sheet",
		headline: "운영중인지 바로,",
		sub: "길찾기까지 한 번에",
		capture: async (page) => {
			await page.goto(`${BASE}/`);
			await page.waitForTimeout(2500);
			await page.getByPlaceholder("명칭·주소·읍면동 검색").fill("한림리");
			await page.locator("button[class*='resultItem']").first().click();
			await page.waitForTimeout(2500);
		},
	},
	{
		name: "03-nearby",
		headline: "내 주변 배출 장소",
		sub: "가까운 순으로 한눈에",
		capture: async (page) => {
			await page.goto(`${BASE}/`);
			await page.waitForTimeout(2500);
			await page.getByRole("button", { name: "내 주변" }).click();
			await page.waitForTimeout(800);
		},
	},
	{
		name: "04-waste",
		headline: "폐건전지는 어디에?",
		sub: "품목 사전에서 검색하면 끝",
		capture: async (page) => {
			await page.goto(`${BASE}/waste`);
			await page.waitForTimeout(1200);
		},
	},
	{
		name: "05-guide",
		headline: "요일별 배출제,",
		sub: "제주시·서귀포시 한 화면에",
		capture: async (page) => {
			await page.goto(`${BASE}/guide`);
			await page.waitForTimeout(1200);
		},
	},
];

async function frame(name: string, headline: string, sub: string) {
	// 프레임: 브랜드 그라데이션 배경 + 헤드라인 + 라운드 스크린샷
	const shotH = H - 430 - 70; // 헤드라인/하단 마진 제외
	const shotW = Math.round((shotH / H) * W);
	const shot = await sharp(join(RAW, `${name}.png`))
		.resize(shotW, shotH)
		.composite([
			{
				input: Buffer.from(
					`<svg width="${shotW}" height="${shotH}"><rect width="${shotW}" height="${shotH}" rx="56" fill="#fff"/></svg>`,
				),
				blend: "dest-in",
			},
		])
		.png()
		.toBuffer();

	const bg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
		<defs>
			<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0" stop-color="#0f8f6c"/>
				<stop offset="1" stop-color="#0a5f47"/>
			</linearGradient>
		</defs>
		<rect width="${W}" height="${H}" fill="url(#g)"/>
		<circle cx="1150" cy="150" r="300" fill="#ffffff" opacity="0.05"/>
		<circle cx="100" cy="2600" r="240" fill="#ffffff" opacity="0.05"/>
		<text x="${W / 2}" y="215" text-anchor="middle" font-family="Pretendard Variable, Pretendard, AppleSDGothicNeo, sans-serif" font-size="86" font-weight="800" fill="#ffffff" letter-spacing="-2">${headline}</text>
		<text x="${W / 2}" y="330" text-anchor="middle" font-family="Pretendard Variable, Pretendard, AppleSDGothicNeo, sans-serif" font-size="86" font-weight="800" fill="#ffd84d" letter-spacing="-2">${sub}</text>
	</svg>`;

	await sharp(Buffer.from(bg))
		.composite([{ input: shot, top: 430, left: Math.round((W - shotW) / 2) }])
		.png()
		.toFile(join(FRAMED, `${name}.png`));
	console.log(`✓ framed/${name}.png (${W}×${H})`);
}

async function main() {
	mkdirSync(RAW, { recursive: true });
	mkdirSync(FRAMED, { recursive: true });

	const browser = await chromium.launch();
	const ctx = await browser.newContext({
		viewport: { width: 430, height: 932 },
		deviceScaleFactor: 3,
		locale: "ko-KR",
		timezoneId: "Asia/Seoul",
		isMobile: true,
		hasTouch: true,
	});
	const page = await ctx.newPage();

	for (const s of SHOTS) {
		await s.capture(page);
		// Next.js dev 도구 오버레이 숨김
		await page.addStyleTag({ content: "nextjs-portal{display:none!important}" }).catch(() => {});
		await page.screenshot({ path: join(RAW, `${s.name}.png`) });
		console.log(`✓ raw/${s.name}.png`);
	}
	await browser.close();

	for (const s of SHOTS) await frame(s.name, s.headline, s.sub);
	console.log("\n완료 — App Store Connect에 framed/*.png 업로드");
}

main();
