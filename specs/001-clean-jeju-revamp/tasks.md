# Tasks: Clean Jeju 전면 개편 (v2)

**Input**: Design documents from `/specs/001-clean-jeju-revamp/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/README.md

**Tests**: constitution 원칙 III(실동작 검증)에 따라 테스트 태스크 포함.

**Organization**: 유저 스토리 단위. 순서 제약: 게이트 → 파이프라인(US2) → 지도(US1) → 페이지/SEO(US3) → 반응형(US4) → DS 정리(US5) → 커트오버/배포.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 병렬 가능 (파일 겹침·의존 없음)
- 🧑 표시: 사용자 직접 액션 필요 (키 발급, sudo 등)

## Phase 1: Setup + 게이트

- [x] T001 pnpm 워크스페이스 구성 (루트 `package.json`+`pnpm-workspace.yaml`, `web/`·`pipeline/` 스캐폴드, Biome 설정 — 레거시 `src/`는 아직 유지)
- [x] T002 `web/`: Next.js(App Router, TS, standalone output) 생성 + Astryx 설치(`@astryxdesign/core`, `@astryxdesign/theme-neutral`, CLI) + theme CSS 전역 import
- [x] T003 **[게이트]** Astryx 스모크: 버튼·카드·다크모드 포함 샘플 페이지가 `pnpm --filter web build`로 SSR 빌드되는지 확인. 실패 시 중단하고 사용자와 대체 DS 재협의
- [x] ~~T004 공공데이터포털 활용신청~~ → **불필요 판명**: fileDownload.do 직접 다운로드가 키 없이 동작 (파이프라인이 atchFileId를 매 실행 파싱). 대신 지오코딩용 `KAKAO_REST_KEY`가 필요 (T005에 통합)
- [ ] 🧑 T005 [P] 카카오 개발자 콘솔: `localhost:3000` + 배포 서브도메인 등록, 서브도메인 명 확정, **REST API 키 발급**(지오코딩 미해석 320건 해소용)

## Phase 2: Foundational

- [x] T006 `pipeline/schemas/`: Site·DisposalRule·Snapshot JSON Schema 작성 (data-model.md 기준)
- [x] T007 [P] `web/lib/data.ts`: `data/*.json` 로더(메모리 캐시+revalidate 무효화), 운영상태·오늘품목 계산(Asia/Seoul 명시, 자정 넘김 처리), 거리·제주 bbox 유틸 이관 (research R5)
- [x] T008 [P] `data/rules.json` 초안: 2025-06-06 개편 기준 제주시·서귀포시 규칙을 고시 원문 대조로 작성 (출처 URL·시행일 포함) — SC-007의 근거

## Phase 3: US2 — 항상 최신인 데이터 (P1)

- [x] T009 `pipeline/src/sources/`: 소스 어댑터 3종 (제주시 클린하우스 API, 서귀포시 클린하우스 — 폐기 시 제주데이터허브 대체 확인, 재활용도움센터)
- [x] T010 `pipeline/src/normalize.ts`: 단일 스키마 정규화 + zod 검증 + 좌표 bbox 검증 + 30m 중복 제거 + 안정 id 생성
- [x] T011 `pipeline/src/report.ts` + `index.ts`: snapshot·rejects 산출, 원자적 파일 교체, 실패 시 기존 데이터 보존 + Resend 이메일 리포트, 성공 시 `POST /api/revalidate`
- [x] T012 파이프라인 통합 테스트: 실 API 대상 건수 하한(클린 ≥ 1,300·재활용 ≥ 70)·스키마·좌표 검증, 실행 결과로 `data/sites.json` 커밋
- [x] ✅ Checkpoint 통과 (2026-07-13): 1,560개소 반영 (제주시 1,310 + 서귀포 172 + 재활용센터 78). 좌표 미해석 320건은 KAKAO_REST_KEY 대기. 추자면 bbox 누락(레거시 버그)·좌표 스왑 보정 반영

## Phase 4: US1 — 내 주변 배출 장소 찾기 (P1) 🎯 MVP

- [x] T013 `web/app/api/map-sites/route.ts`: 경량 투영 응답 (contracts §2, < 250KB gzip)
- [x] T014 `web/components/map/`: 카카오맵 클라이언트 위젯 — 마커+클러스터러(1회 생성, 공식 API만), 유형 필터, 현위치(허용/거부/제주外 3경로 — 거부 시 5초 내 기본 뷰, 무한 로딩 금지)
- [x] T015 `web/app/(map)/page.tsx`: 지도 홈 — 오늘 배출 품목 배너(rules 기반), 데이터 기준일 표시, 검색(명칭+주소, 거리순) + 결과 리스트
- [x] T016 E2E(Playwright): 권한 3경로, 검색, 자정 넘김 운영상태(02:00 mock), 빈 결과 UI
- [x] ✅ Checkpoint 통과 (2026-07-13): E2E 12/12 (권한 3경로·검색·빈결과·배너, 데스크톱+모바일) + 단위 13개(자정넘김·TZ). 브라우저 실동작 확인 — MVP 완성

## Phase 5: US3 — 안내·상세 페이지 + SEO (P2)

- [x] T017 [P] `web/app/guide/`: 배출제 안내(시별 탭, 오늘 강조, FAQ + JSON-LD FAQPage) — rules.json만으로 렌더링
- [x] T018 [P] `web/app/recycle-center/[id]/`: 재활용도움센터 78개 상세 (지도·운영시간·길찾기 링크·JSON-LD)
- [x] T019 [P] `web/app/clean-house/[district]/[emd]/`: 읍면동 묶음 페이지 (개소 목록+지도)
- [x] T020 `web/app/sitemap.ts`·`robots.ts`·페이지별 generateMetadata/OG + `api/revalidate` 구현 (contracts §2·§3)
- [x] T021 E2E: JS-off 크롤러 시점에서 안내·상세 본문 HTML 존재, sitemap 전 URL 포함 검증
- [x] ✅ Checkpoint 통과 (2026-07-13): 정적 131페이지 생성, JS-off 본문·sitemap(124 URL)·robots·FAQPage JSON-LD E2E 검증. Lighthouse 측정은 실도메인 배포 후(T033)

## Phase 6: US4 — 모바일 반응형 (P2) ✅ (2026-07-13)

- [x] T022 모바일 우선 레이아웃: 지도 홈 바텀시트(마커 탭 → 요약 → 상세 이동), 데스크톱 지도+사이드 패널
- [x] T023 E2E 뷰포트 매트릭스(375/768/1440): 가로 스크롤·겹침 0건, 3인터랙션 내 주변 확인(SC-003)

## Phase 7: US5 — 디자인시스템 정리 (P3)

- [ ] T024 전 화면 Astryx 토큰·컴포넌트 일원화 + 다크모드 검증, 커스텀 스타일 잔재 정리
- [ ] T025 제보 폼(`/api/report`): honeypot+rate limit+Resend 발송 (FR-019, contracts §2)

## Phase 8: US6 — 브랜드 자산 + PWA (P3)

- [ ] T026 `brand/logo.svg`: 기존 로고(Clean_house.svg 등) 모티프 + Astryx 팔레트로 마스터 로고 리디자인 (MCP 커넥터 — Figma/Pencil 활용)
- [ ] T027 `brand/generate.ts`(sharp): 마스터 SVG → maskable/any 아이콘(192/512)·파비콘·Apple touch·스플래시·OG(1200×630) 전 규격 자동 생성 → `web/public/`
- [ ] T028 [P] `brand/animations/`: 로딩·빈상태 마이크로 애니메이션 — CSS/SVG로 충분한지 먼저 판단, 필요 시 Rive(rivemcp) 제작 + `@rive-app/react-canvas` 적용
- [ ] T029 PWA: `web/app/manifest.ts` + Serwist 서비스 워커(앱 셸 + rules/snapshot 캐시 폴백) + 재방문 설치 유도 UI, Lighthouse PWA 설치 가능 판정 통과(SC-008)

## Phase 9: 커트오버·배포

- [ ] T030 레거시 제거: `src/`·`public/`(CRA 잔재)·CRA deps·`REAMD.md`·`.idea/`·`.swp`, README 갱신(새 구조·출처 고지 유지), 기존 기능 회귀 체크리스트 대조
- [ ] T031 `deploy/`: systemd 유닛 3종 + `.env` 주입(SOPS 체계), 타이머는 UTC 기준 작성
- [ ] 🧑 T032 홈서버 배포: pull+build 후 sudo로 유닛 설치·기동, cloudflared 라우트 추가(Cloudflare API), 서브도메인 연결
- [ ] T033 실도메인 검증: E2E 전 시나리오 + Lighthouse(SC-004) + 파이프라인 타이머 1주기 관찰(SC-002)
- [ ] 🧑 T034 Google Search Console 등록 + sitemap 제출 → 4주 색인 추적(SC-001)

## Phase 10: US6 — Android TWA (실도메인 확보 후)

- [ ] 🧑 T035 Google Play 개발자 계정 확보 ($25 1회, 미보유 시)
- [ ] T036 `app-android/`: Bubblewrap TWA 프로젝트 생성 + `web/public/.well-known/assetlinks.json` 서빙 (서명 키 SHA-256 연동, 키는 미커밋·SOPS 보관)
- [ ] 🧑 T037 Play Console 내부 테스트 트랙 업로드 → Android 실기기에서 standalone 실행으로 US1 플로우 확인(SC-008), iOS는 홈 화면 추가 경로 확인

## Dependencies

- T003 게이트 실패 시 T002 이후 전면 보류 (DS 재협의)
- Phase 3(US2)이 Phase 4~7의 실데이터 전제 (T012 산출물)
- T004는 T009의, T005는 T014의 선행 조건
- T026(마스터 로고) → T027(규격 생성) → T029(PWA 매니페스트가 아이콘 참조)
- Phase 9(커트오버)는 Phase 1~8 완료 후, Phase 10(TWA)은 실도메인(T032) 확보 후 — Digital Asset Links가 실도메인 HTTPS 필수
