# 클린 제주 (Clean Jeju)

제주 클린하우스·재활용도움센터 위치와 **오늘 배출 가능한 재활용품**을 알려주는 서비스입니다.
공공데이터를 매주 자동 수집하므로 항상 최신 정보를 제공합니다.

🌐 **https://jejucleanhouse.com** (오픈 준비 중 — DNS 전파 대기)

> v2 전면 개편 (2026-07): CRA+Redux+정적 스냅샷(2021) → Next.js 16 + Astryx + 자동 데이터
> 파이프라인 + iOS 앱. 설계 문서: [specs/001-clean-jeju-revamp/](specs/001-clean-jeju-revamp/) (spec-kit SDD)

## 기능

- 🗺 **지도** — 클린하우스 1,670여 곳·재활용도움센터 179곳, 운영 상태별 마커, 유형 필터
- 📅 **오늘 배출** — 요일별 배출제(2025-06-06 개편, 제주시/서귀포시)를 하단 바에 상시 표시.
  규칙은 코드가 아닌 [data/rules.json](data/rules.json) — 조례가 바뀌면 데이터만 갱신
- 📍 **내 주변 / 지금 열린 곳** — 거리순 리스트 원탭, 운영 중인 최근접 개소 점프
- ⭐ **즐겨찾기** — 우리 집 클린하우스 저장(localStorage), 운영 상태와 함께 원탭 이동
- 🔎 **분리배출 품목 사전** — "폐건전지 어디에 버려?" 17품목 검색, 요일 규칙 연동 ([/waste](https://jejucleanhouse.com/waste))
- 🔔 **배출일 푸시** — 매일 15:00(배출 시작)에 오늘 품목 웹푸시
- 📄 **SEO 페이지 258** — 배출제 안내·FAQ·도움센터 상세(179)·읍면동별 클린하우스(42)·품목(17)
- 📱 **모바일 앱형 UX** — 풀블리드 지도 + 플로팅 UI, 바텀시트, 플로팅 독, 다크모드, PWA 설치
- 📨 **정보 제보** — 폼 제출 → 운영자 이메일 (honeypot·rate limit)

## 구조

```
web/        Next.js 16 (App Router) + Astryx 디자인시스템 — 서비스 본체
pipeline/   공공데이터 수집·정규화 (주 1회 systemd timer, 키리스 수집 + 카카오 지오코딩)
data/       파이프라인 산출물 (sites 1,855곳 · rules · snapshot · geocache) — git 추적
app-ios/    iOS 앱 (Expo 54 웹뷰 래퍼) — App Store 제출용, EAS 빌드
brand/      로고 마스터(SVG) · 자산 생성 · App Store 스크린샷 스크립트
deploy/     홈서버 systemd 유닛 (웹 :3005 / 주간 파이프라인 / 일일 푸시) — deploy/README.md
```

## 개발

```bash
pnpm install
pnpm collect               # 데이터 수집 (공공데이터포털 — 서비스 키 불필요)
pnpm dev                   # http://localhost:8080 (카카오 키 등록 포트)
pnpm test && pnpm e2e      # 단위 25 + Playwright E2E 57
```

- `web/.env.local`: `NEXT_PUBLIC_KAKAO_JS_KEY` 필요 — [web/.env.example](web/.env.example)
- 지오코딩(신규 주소)은 `KAKAO_REST_KEY` 설정 시 파이프라인이 자동 수행
- 브랜드 자산 재생성: `pnpm exec tsx brand/generate.ts` /
  스토어 스크린샷: `pnpm exec tsx brand/appstore-shots.ts`
- iOS: `cd app-ios && pnpm install --ignore-workspace` (⚠️ 루트 워크스페이스와 분리 필수) —
  빌드·심사는 [app-ios/README.md](app-ios/README.md)·[store-listing.md](app-ios/store-listing.md)

## 데이터 출처 (OSS Notice)

이 서비스는 공공데이터포털(data.go.kr)과 제주특별자치도의 공공데이터를 사용합니다.

- [제주특별자치도 제주시_클린하우스](https://www.data.go.kr/data/15110514/fileData.do) — © DATA.go.kr
- [제주특별자치도 서귀포시_클린하우스현황](https://www.data.go.kr/data/15056472/fileData.do) — © DATA.go.kr
- [제주특별자치도_재활용도움센터현황](https://www.data.go.kr/data/15045364/fileData.do) — © DATA.go.kr
- 요일별 배출제 규칙: [제주시](https://www.jejusi.go.kr/field/eco/weekwaste.do) · [서귀포시](https://www.seogwipo.go.kr/recycle/index.htm) 공식 안내
- 지도: Kakao Maps JS SDK

## Contributors

- 양지웅 (PM) — [@Woongstar](https://github.com/Woongstar)
- 양상우 (FE) — [@IGhost-P](https://github.com/IGhost-P)
- 염상권 (FE) — [@Yummy-sk](https://github.com/Yummy-sk)

## License

[MIT](LICENSE)
