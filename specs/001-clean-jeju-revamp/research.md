# Research: Clean Jeju 전면 개편 (v2)

**Date**: 2026-07-13 | **Feature**: [spec.md](spec.md)

## R1. 데이터 소스 현황 (2026-07 조사)

| 데이터 | 출처 | 상태 | 갱신주기 |
|---|---|---|---|
| 제주시 클린하우스 | data.go.kr `15110514` (제주특별자치도 제주시_클린하우스_20241106) | 활성, 1,359행, CSV/JSON/XML + REST | 연간 (최근 2024-11-27) |
| 서귀포시 클린하우스 | data.go.kr `15056472` (파일데이터) | plan 단계 재확인 필요 — 폐기 시 제주데이터허브 대체 | 연간 |
| 재활용도움센터 | jeju.go.kr 환경 페이지 / 제주데이터허브 | 활성 | 수시 |
| 요일별 배출제 규칙 | 제주도 고시 (2025-06-06 개편 시행) | 제주시·서귀포시 규칙 상이 | 조례 개정 시 |

**Decision**: 공공데이터포털 REST API(서비스 키 필요 — 회원가입 후 활용신청) + 파일데이터 다운로드를 파이프라인에서 소스별 어댑터로 처리. 배출 규칙은 자동 수집이 불가능한 고시 문서이므로 **출처·시행일을 포함한 큐레이션 데이터 파일**(`rules.json`)로 관리 — 코드 하드코딩이 아니므로 constitution 원칙 I 충족.

**Rejected**: 기존 Gist 방식(박제), 고시 웹페이지 스크래핑(형식 불안정).

## R2. 렌더링·배포 전략

**Decision**: Next.js App Router, **Node standalone 서버 + ISR(on-demand revalidate)**.
- 안내·상세 페이지: SSG + on-demand revalidate (파이프라인이 데이터 갱신 후 revalidate API 호출)
- 지도 화면: 서버 컴포넌트 셸 + 클라이언트 지도 위젯 (데이터는 경량 JSON route로 공급)
- 홈서버 systemd 서비스(`next start`, standalone output) + cloudflared 터널 서브도메인

**Rejected**:
- `next export` 정적 내보내기: 제보 폼(API route)·on-demand revalidate 불가, 데이터 갱신마다 전체 재빌드 필요
- Vercel 등 외부 호스팅: 홈서버 운영 원칙(V)과 상충

## R3. Astryx × Next.js 호환성 (constitution 게이트)

**Decision**: 채택 가능. Astryx 공식 리포가 Next.js 예제 앱 4종을 제공
(`example-nextjs`(theme CSS), `example-nextjs-stylex`, `example-nextjs-tailwind`,
`example-nextjs-source`). **"Next.js + theme CSS" 패턴 채택**: `@astryxdesign/core` +
`@astryxdesign/theme-neutral`의 사전 컴파일 CSS를 전역 import — 빌드 플러그인 불필요.
커스텀 스타일이 필요해지면 StyleX 통합(example-nextjs-stylex)으로 확장.
- 패키지: `@astryxdesign/core`, `@astryxdesign/theme-neutral`, dev: `@astryxdesign/cli`
- `npx astryx init`으로 에이전트 문서·테마 스캐폴딩
- **리스크**: Beta — 구현 첫 태스크에서 실제 설치+빌드 스모크 테스트로 게이트 통과 확인

## R4. 지도 구현

**Decision**: Kakao Maps JS SDK를 클라이언트 컴포넌트로 래핑 (`react-kakao-maps-sdk`
라이브러리 채택, 유지보수 중단 시 자체 thin wrapper로 대체 가능하게 격리).
- 클러스터러는 SDK 내장 MarkerClusterer 사용 — **1회 생성 후 마커 일괄 추가** (레거시의 루프 내 재생성 버그 재발 금지)
- 좌표 접근은 공식 API(`getLat()/getLng()`)만 사용 (레거시 `.Ma/.La/.fb` 금지)
- 지도용 데이터는 경량 필드만(id, name, lat, lng, type, status)으로 별도 엔드포인트 제공 — 2,400건 ≈ 200KB 미만 목표

## R5. 레거시 이관 대상 (원칙 IV — 기존 의도 인벤토리)

| 레거시 | 의도 | 이관 방침 |
|---|---|---|
| `GetDistanceFromLatLonInKm` | Haversine 거리 계산 | 유틸로 이관 (TS) |
| `checkInJuju` bbox (33.19~33.56, 125.98~127.09) | 제주 내 접속 판정 | 유지 (경계값 검증 후) |
| 클러스터 파라미터 (gridSize 100/150, minLevel 5) | 유형별 클러스터 밀도 튜닝 | 초기값으로 계승 |
| 운영시간 15:00~04:00 표시 | 자정 넘김 운영 개소 존재 | 개소별 데이터 기반 계산으로 일반화 |
| 유형별 마커/클러스터 아이콘 SVG | 클린하우스/재활용센터 구분 시각화 | 디자인 리뉴얼 시 참조 |
| 무한스크롤 리스트 + 거리순 정렬 | 검색 결과 탐색 UX | 유지 (가상 스크롤 검토) |

**폐기**: Redux 전역 상태(서버 컴포넌트+로컬 상태로 대체), 지도 전체 재생성 방식, `alert()` UX, 개인 이메일 mailto 신고.

## R6. 제보 폼 메일 발송

**Decision**: Next.js route handler → 홈서버 기존 메일 발송 인프라(Resend, 시크릿은
`~/deploy` SOPS 체계) 재사용. rate limit(IP당 시간당 N건) + honeypot 필드로 스팸 방지.
운영자 알림 방침: 제보·파이프라인 실패 모두 이메일 (긴급 채널 아님).

## R7. 앱 배포 전략 (2차 추가 스코프)

**Decision**: **PWA 기본 + Android TWA(Trusted Web Activity)**.
- PWA: Next.js에 manifest + 서비스 워커(Serwist 채택 — next-pwa 후속, App Router 대응) + 설치 유도 UI. 오프라인은 앱 셸 + 마지막 `rules`/`snapshot` 캐시 폴백
- Android: Bubblewrap CLI로 TWA 패키징 → Play Store 내부 테스트 트랙부터. `/.well-known/assetlinks.json`(Digital Asset Links)을 웹에서 서빙 — 홈서버 배포에 포함
- iOS: PWA 홈 화면 추가로 제공. **App Store 제출은 범위 외** — 순수 WebView 래퍼는 심사 가이드라인 4.2(최소 기능성) 반려 리스크가 높음. 푸시 알림 등 네이티브 요구가 생기면 Capacitor로 재검토

**Rejected**: Capacitor/React Native WebView 즉시 도입(네이티브 기능 요구가 아직 없어 빌드·서명·업데이트 이중화 비용만 발생), iOS 스토어 동시 제출(반려 리스크).

**사용자 액션**: Google Play 개발자 계정($25 1회) 필요.

## R8. 브랜드 자산 제작 (아이콘·애니메이션)

**Decision**: 기존 로고 SVG(`Clean_house.svg`, `recycle_center.svg` 등 2021 자산)를
모티프로 유지하되 Astryx 토큰 팔레트에 맞춰 리디자인.
- **정적 자산**: 마스터 SVG 1종에서 스크립트(sharp)로 전 규격 자동 생성 — maskable/any 아이콘(192/512), 파비콘, Apple touch icon, 스플래시, OG 이미지(1200×630). 제작 도구는 보유 MCP 커넥터(Figma/Pencil/Canva, 필요시 ComfyUI) 활용
- **애니메이션**: 로딩·빈상태·설치 안내 마이크로 애니메이션은 **Rive 우선**(rivemcp 커넥터로 제작 가능, `@rive-app/react-canvas` 런타임 ~40KB). Lottie는 제작 파이프라인이 없어 차선. 단순한 것은 CSS/SVG 애니메이션으로 충분한지 먼저 판단 (과한 런타임 의존 경계 — constitution V)

## R9. 테스트 전략 (원칙 III)

- **파이프라인**: 실제 API 응답 대상 통합 테스트 (건수 하한·스키마·좌표 범위 검증). 실패 행 격리 리포트의 스냅샷 테스트
- **웹**: Playwright E2E — 위치 권한 허용/거부/제주 외 3경로, 검색, 상세·안내 페이지 SSR 본문 존재(JS off), 375px 뷰포트
- **완료 기준**: 홈서버 실배포 + 실도메인에서 시나리오 통과
