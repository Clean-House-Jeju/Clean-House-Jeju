/**
 * 브랜드 자산 생성 (T027) — brand/logo.svg 마스터에서 전 규격 자동 생성.
 * 실행: pnpm exec tsx brand/generate.ts
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOGO = join(ROOT, "brand/logo.svg");
const OUT = join(ROOT, "web/public");

const BG = "#0d7d5e";

async function icon(size: number, out: string, opts?: { pad?: number; bg?: string }) {
	const pad = Math.round(size * (opts?.pad ?? 0));
	const inner = size - pad * 2;
	const logo = await sharp(LOGO).resize(inner, inner).png().toBuffer();
	await sharp({
		create: {
			width: size,
			height: size,
			channels: 4,
			background: opts?.bg ?? { r: 0, g: 0, b: 0, alpha: 0 },
		},
	})
		.composite([{ input: logo, top: pad, left: pad }])
		.png()
		.toFile(join(OUT, out));
	console.log(`✓ ${out} (${size}px)`);
}

async function ogImage() {
	// OG 1200×630 — 브랜드 배경 + 로고 + 워드마크
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
		<defs>
			<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0" stop-color="#0f8f6c"/>
				<stop offset="1" stop-color="#0a5f47"/>
			</linearGradient>
		</defs>
		<rect width="1200" height="630" fill="url(#bg)"/>
		<circle cx="1050" cy="80" r="220" fill="#ffffff" opacity="0.06"/>
		<circle cx="120" cy="560" r="160" fill="#ffffff" opacity="0.05"/>
		<text x="330" y="300" font-family="Pretendard Variable, Pretendard, AppleSDGothicNeo, sans-serif" font-size="88" font-weight="800" fill="#ffffff" letter-spacing="-3">클린 제주</text>
		<text x="333" y="372" font-family="Pretendard Variable, Pretendard, AppleSDGothicNeo, sans-serif" font-size="34" font-weight="500" fill="#c9f0e3">제주 클린하우스·재활용도움센터 안내</text>
		<text x="333" y="430" font-family="Pretendard Variable, Pretendard, AppleSDGothicNeo, sans-serif" font-size="28" font-weight="500" fill="#8fd8c0">오늘 버릴 수 있는 재활용품을 바로 확인하세요</text>
	</svg>`;
	const logo = await sharp(LOGO).resize(200, 200).png().toBuffer();
	await sharp(Buffer.from(svg))
		.composite([{ input: logo, top: 215, left: 100 }])
		.png()
		.toFile(join(OUT, "og.png"));
	console.log("✓ og.png (1200×630)");
}

async function main() {
	mkdirSync(OUT, { recursive: true });
	await icon(192, "icon-192.png");
	await icon(512, "icon-512.png");
	// maskable: 안전 영역 확보(20% 패딩) + 브랜드 배경
	await icon(192, "icon-maskable-192.png", { pad: 0.18, bg: BG });
	await icon(512, "icon-maskable-512.png", { pad: 0.18, bg: BG });
	await icon(180, "apple-touch-icon.png", { pad: 0.12, bg: BG });
	await ogImage();
	// Next.js app/icon.svg — 파비콘은 마스터 SVG 그대로
	writeFileSync(join(ROOT, "web/app/icon.svg"), readFileSync(LOGO));
	console.log("✓ web/app/icon.svg");
}

main();
