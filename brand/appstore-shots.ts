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
	tag: string;
	capture: (page: Page) => Promise<void>;
}

const SHOTS: Shot[] = [
	{
		name: "01-map",
		headline: "버리러 나가기 전",
		sub: "3초면 끝",
		tag: "오늘 배출",
		capture: async (page) => {
			await page.goto(`${BASE}/`);
			await page.waitForTimeout(3500); // 지도 타일 로드
		},
	},
	{
		name: "02-sheet",
		headline: "지금 열었을까?",
		sub: "바로 보여요",
		tag: "운영 상태",
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
		headline: "우리 동네 1,800곳",
		sub: "가까운 순으로",
		tag: "내 주변",
		capture: async (page) => {
			await page.goto(`${BASE}/`);
			await page.waitForTimeout(2500);
			await page.getByRole("button", { name: "내 주변" }).click();
			await page.waitForTimeout(800);
		},
	},
	{
		name: "04-waste",
		headline: "이건 어디에 버리지?",
		sub: "검색 한 번이면 끝",
		tag: "품목 사전",
		capture: async (page) => {
			await page.goto(`${BASE}/waste`);
			await page.waitForTimeout(1200);
		},
	},
	{
		name: "05-guide",
		headline: "헷갈리는 요일별 배출제",
		sub: "한 화면에 정리",
		tag: "배출 안내",
		capture: async (page) => {
			await page.goto(`${BASE}/guide`);
			await page.waitForTimeout(1200);
		},
	},
];

async function frame(name: string, headline: string, sub: string, tag: string) {
	// 프로덕션 프레임: 디바이스 베젤 목업 + 소프트 섀도 + 하단 블리드 + 혜택 카피
	const DEVICE_W = 1120;
	const BEZEL = 26;
	const SCREEN_W = DEVICE_W - BEZEL * 2;
	const SCREEN_H = Math.round((SCREEN_W / W) * H);
	const DEVICE_H = SCREEN_H + BEZEL * 2;
	const DEV_TOP = 585;
	const DEV_LEFT = Math.round((W - DEVICE_W) / 2);

	// 스크린: 라운드 마스크
	const screen = await sharp(join(RAW, `${name}.png`))
		.resize(SCREEN_W, SCREEN_H)
		.composite([
			{
				input: Buffer.from(
					`<svg width="${SCREEN_W}" height="${SCREEN_H}"><rect width="${SCREEN_W}" height="${SCREEN_H}" rx="118" fill="#fff"/></svg>`,
				),
				blend: "dest-in",
			},
		])
		.png()
		.toBuffer();

	// 디바이스: 다크 베젤 + 스크린
	const device = await sharp(
		Buffer.from(
			`<svg width="${DEVICE_W}" height="${DEVICE_H}"><rect width="${DEVICE_W}" height="${DEVICE_H}" rx="${118 + BEZEL}" fill="#131619"/><rect x="3" y="3" width="${DEVICE_W - 6}" height="${DEVICE_H - 6}" rx="${115 + BEZEL}" fill="none" stroke="#3a4148" stroke-width="2.5"/></svg>`,
		),
	)
		.composite([{ input: screen, top: BEZEL, left: BEZEL }])
		.png()
		.toBuffer();

	// 소프트 섀도 — 풀캔버스 레이어 (블리드·음수 좌표 문제 회피)
	const H_EXT = DEV_TOP + DEVICE_H + 140;
	const shadow = await sharp(
		Buffer.from(
			`<svg width="${W}" height="${H_EXT}"><rect x="${DEV_LEFT + 14}" y="${DEV_TOP + 40}" width="${DEVICE_W - 28}" height="${DEVICE_H}" rx="${118 + BEZEL}" fill="#04140e" fill-opacity="0.55"/></svg>`,
		),
	)
		.blur(40)
		.png()
		.toBuffer();

	// 배경: 그라데이션 + 라디얼 글로우 + 브랜드 마크 워터마크 + 카피
	const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
	const FONT = "Pretendard Variable, Pretendard, AppleSDGothicNeo, sans-serif";
	const bg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H_EXT}">
		<defs>
			<linearGradient id="g" x1="0" y1="0" x2="0.9" y2="1">
				<stop offset="0" stop-color="#118a68"/>
				<stop offset="0.55" stop-color="#0b6b50"/>
				<stop offset="1" stop-color="#07503b"/>
			</linearGradient>
			<radialGradient id="glow" cx="0.5" cy="0.42" r="0.62">
				<stop offset="0" stop-color="#3ec59c" stop-opacity="0.5"/>
				<stop offset="1" stop-color="#3ec59c" stop-opacity="0"/>
			</radialGradient>
		</defs>
		<rect width="${W}" height="${H_EXT}" fill="url(#g)"/>
		<rect width="${W}" height="${H}" fill="url(#glow)"/>
		<g opacity="0.055" transform="translate(880 -180) scale(11)">
			<path d="M 19.50 19.05 A 18 18 0 0 1 44.50 19.05" fill="none" stroke="#fff" stroke-width="9.5" stroke-linecap="round"/>
			<path d="M 27.31 49.30 A 18 18 0 0 1 14.53 27.65" fill="none" stroke="#fff" stroke-width="9.5" stroke-linecap="round"/>
			<path d="M 49.47 27.65 A 18 18 0 0 1 36.96 49.30" fill="none" stroke="#fff" stroke-width="9.5" stroke-linecap="round"/>
		</g>
		<g>
			<rect x="${W / 2 - 108}" y="128" width="216" height="64" rx="32" fill="#ffffff" fill-opacity="0.14"/>
			<text x="${W / 2}" y="172" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="700" fill="#b9ecd9" letter-spacing="1">${esc(tag)}</text>
		</g>
		<text x="${W / 2}" y="312" text-anchor="middle" font-family="${FONT}" font-size="104" font-weight="800" fill="#ffffff" letter-spacing="-3">${esc(headline)}</text>
		<text x="${W / 2}" y="446" text-anchor="middle" font-family="${FONT}" font-size="104" font-weight="800" fill="#ffd84d" letter-spacing="-3">${esc(sub)}</text>
	</svg>`;

	const composed = await sharp(Buffer.from(bg))
		.composite([
			{ input: shadow, top: 0, left: 0 },
			{ input: device, top: DEV_TOP, left: DEV_LEFT },
		])
		.png()
		.toBuffer();
	await sharp(composed).extract({ left: 0, top: 0, width: W, height: H }).png().toFile(join(FRAMED, `${name}.png`));
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

	for (const s of SHOTS) await frame(s.name, s.headline, s.sub, s.tag);
	console.log("\n완료 — App Store Connect에 framed/*.png 업로드");
}

main();
