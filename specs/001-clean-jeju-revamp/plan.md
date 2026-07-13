# Implementation Plan: Clean Jeju 전면 개편 (v2)

**Branch**: `001-clean-jeju-revamp` | **Date**: 2026-07-13 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-clean-jeju-revamp/spec.md`

## Summary

2021년 CRA+Redux+박제 Gist 데이터 앱을 전면 대체한다: 공공데이터 원본을 주기
수집·정규화하는 파이프라인(`pipeline/`)과, Astryx 디자인시스템 기반 Next.js App
Router 웹 앱(`web/`)을 같은 리포에 구성한다. 콘텐츠 페이지는 SSG + on-demand
revalidate로 SEO를 확보하고, 지도는 클라이언트 위젯으로 격리한다. 홈서버에
systemd 서비스(웹) + systemd timer(파이프라인)로 배포하고 cloudflared 서브도메인으로
공개한다.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 22 (홈서버 nvm v22.22.0과 일치)

**Primary Dependencies**: Next.js (App Router, standalone output), `@astryxdesign/core` + `@astryxdesign/theme-neutral` (theme CSS 패턴), `react-kakao-maps-sdk` + Kakao Maps JS SDK(clusterer), zod(파이프라인 검증), Resend(제보 메일), Serwist(PWA 서비스 워커), Bubblewrap(Android TWA 패키징)

**Storage**: 파일 기반 — `data/*.json` (파이프라인 산출물, git 추적으로 이력 보존). DB 없음 (constitution V)

**Testing**: Vitest(단위·파이프라인 통합), Playwright(E2E — 권한 3경로·JS-off SSR 검증·모바일 뷰포트)

**Target Platform**: 홈서버 Linux (systemd + cloudflared), 클라이언트는 모바일 우선 웹

**Project Type**: web (모노리포: web 앱 + pipeline CLI)

**Performance Goals**: 지도 초기 마커 표시 < 2s (SC-006), Lighthouse 모바일 SEO ≥ 95·성능 ≥ 80 (SC-004), map-sites payload < 250KB gzip

**Constraints**: HTTPS 필수(geolocation), TZ=Asia/Seoul 명시적 처리(홈서버 TZ=UTC), 공공데이터포털 서비스 키 필요, 카카오 콘솔에 신규 도메인 등록 필요

**Scale/Scope**: 개소 ~2,400+, 정적 페이지 ~120+ (읍면동 ~40 + 재활용센터 78 + 안내), 화면 6종

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 원칙 | 판정 | 근거 |
|---|---|---|
| I. 데이터 신선도 우선 | ✅ | 파이프라인 자동 수집, 배출 규칙은 출처·시행일 포함 `rules.json` 데이터 관리, 기준일 노출(FR-005) |
| II. SEO 가능한 렌더링 | ✅ | 콘텐츠 페이지 SSG+revalidate, 클라이언트 렌더링은 지도 위젯에 한정 |
| III. 실동작 검증 | ✅ | 파이프라인은 실 API 통합 테스트, E2E는 실빌드·실배포 대상 (research R7) |
| IV. 기존 의도 존중 | ✅ | 레거시 이관 인벤토리 작성 완료 (research R5), 회귀 체크리스트로 유지 |
| V. 단순한 운영 | ✅ | 배포 단위 2개(웹 서비스 + 파이프라인 타이머), DB 없음, 외부 유료 의존 없음(기존 Resend 재사용) |
| 스택 제약 | ✅ | Astryx×Next.js 호환 확인 (research R3, 공식 예제 4종). Beta 리스크는 구현 첫 태스크의 스모크 테스트로 게이트 |

## Project Structure

### Documentation (this feature)

```text
specs/001-clean-jeju-revamp/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── README.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks - 미생성)
```

### Source Code (repository root)

```text
web/                          # Next.js 앱 (App Router, TypeScript)
├── app/
│   ├── (map)/page.tsx        # 지도 홈 (SSR 셸)
│   ├── manifest.ts           # PWA 웹 앱 매니페스트
│   ├── guide/                # 배출제 안내, faq/
│   ├── recycle-center/       # 목록 + [id]/ 상세 (78)
│   ├── clean-house/[district]/[emd]/  # 읍면동 묶음 페이지
│   ├── api/
│   │   ├── map-sites/route.ts
│   │   ├── revalidate/route.ts
│   │   └── report/route.ts
│   ├── sitemap.ts / robots.ts
│   └── layout.tsx            # Astryx theme CSS 전역 import
├── components/
│   ├── map/                  # 클라이언트 지도 위젯 (KakaoMap, Clusterer, BottomSheet)
│   └── ...                   # Astryx 조합 컴포넌트
├── lib/                      # data 로더(캐시), 운영상태·오늘품목 계산, 거리·bbox 유틸(레거시 이관)
├── public/.well-known/assetlinks.json  # TWA Digital Asset Links
├── sw.ts                     # 서비스 워커 (Serwist — 앱 셸 + 데이터 폴백)
└── e2e/                      # Playwright

brand/                        # 브랜드 마스터 자산
├── logo.svg                  # 리디자인 마스터 (기존 Clean_house.svg 모티프)
├── animations/               # Rive(.riv) 마이크로 애니메이션
└── generate.ts               # sharp — 아이콘·스플래시·OG 전 규격 생성 → web/public/

app-android/                  # Bubblewrap TWA 프로젝트 (twa-manifest.json, 서명 키는 미커밋)

pipeline/
├── src/
│   ├── sources/              # 소스별 어댑터 (jeju-cleanhouse, seogwipo-cleanhouse, recycle-center)
│   ├── normalize.ts          # 단일 스키마 변환·검증·중복 제거
│   ├── report.ts             # 스냅샷·격리 리포트, 실패 시 이메일
│   └── index.ts              # CLI 엔트리 (run once)
├── schemas/                  # 산출물 JSON Schema
└── tests/

data/                         # 파이프라인 산출물 (git 추적)
├── sites.json
├── rules.json                # 큐레이션 (출처·시행일 포함)
├── snapshot.json
└── rejects/

deploy/
├── clean-jeju.service        # 웹 systemd 유닛
├── clean-jeju-pipeline.service
└── clean-jeju-pipeline.timer

src/, public/ (레거시 CRA)     # 커트오버 태스크에서 제거
```

**Structure Decision**: 단일 리포 2-패키지(web, pipeline) + 파일 계약(`data/`).
프론트/백엔드 분리 서버를 두지 않고 Next.js route handler가 유일한 서버 API다
(constitution V). 레거시 `src/`는 E2E 회귀 체크리스트 통과 후 같은 브랜치에서 제거한다.

## Complexity Tracking

> 위반 없음 — 해당 없음.

## Phase 2 준비 (/speckit-tasks 입력)

태스크 생성 시 유저 스토리 우선순위(US1·US2=P1 → US3·US4=P2 → US5=P3)를 따르되,
다음 순서 제약을 반영한다:

1. **T-게이트**: Astryx 설치 + Next.js 빌드 스모크 (실패 시 사용자와 대체 DS 재협의)
2. **파이프라인 먼저** (US2): 데이터 없이는 어떤 화면도 실데이터 검증 불가 (원칙 III)
   - 선행 수동 단계: 공공데이터포털 활용신청(서비스 키) — 사용자 액션 필요
3. 웹 기반 구조(레이아웃·데이터 로더) → US1 지도 → US3 페이지·SEO → US4 반응형 → US5 DS 정리
4. **커트오버**: 레거시 제거 → 배포(systemd·cloudflared·카카오 콘솔 도메인 등록 — sudo는 사용자 직접) → 실도메인 E2E → Search Console 등록
5. **앱 배포 (US6, 실도메인 확보 후)**: 브랜드 자산 → PWA(manifest·SW·설치 UI) → TWA 패키징·Play 내부 테스트 (Digital Asset Links는 실도메인 필수라 커트오버 이후에만 가능)
