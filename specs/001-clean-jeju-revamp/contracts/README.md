# Contracts: Clean Jeju v2

파이프라인 ↔ 웹 앱 간 계약. 스키마 변경 시 이 문서를 먼저 갱신한다 (constitution: Development Workflow).

## 1. 파일 계약 (파이프라인 산출물 → 웹)

파이프라인은 `DATA_DIR`(기본 `<repo>/data/`)에 원자적으로(임시 파일 → rename) 기록한다.

| 파일 | 스키마 | 소비자 |
|---|---|---|
| `data/sites.json` | `Site[]` ([data-model.md](../data-model.md)) | 웹 서버 (전체), 지도 API (경량 투영) |
| `data/rules.json` | `DisposalRule[]` | 안내 페이지, "오늘 배출 품목" 위젯 |
| `data/snapshot.json` | `Snapshot` | 기준일 표시, 운영 리포트 |
| `data/rejects/<ts>.json` | 격리 행 상세 | 운영자 점검용 (웹 미노출) |

검증: 파이프라인은 기록 전 JSON Schema(`pipeline/schemas/*.schema.json`)로 산출물을 자체 검증한다. 검증 실패 시 기존 파일을 덮어쓰지 않는다 (FR-004).

## 2. HTTP 계약 (웹 앱)

### `GET /api/map-sites`
지도용 경량 데이터. 응답: `{ asOf: string, sites: { id, name, lat, lng, type, district, openTime?, closeTime?, open24h? }[] }`
- 캐시: `s-maxage` + 파이프라인 revalidate 시 무효화. 목표 payload < 250KB (gzip)

### `POST /api/revalidate`
파이프라인이 데이터 갱신 후 호출. 헤더 `x-revalidate-token: <secret>`.
- 동작: 데이터 캐시 무효화 + 안내/상세/sitemap 경로 revalidate
- 응답: `{ revalidated: true, asOf: string }` / 401 (토큰 불일치)

### `POST /api/report`
제보 폼 수신. body: `{ siteId?: string, category: "wrong-info" | "closed" | "suggestion", message: string, contact?: string, website?: string }`
- `website`는 honeypot — 값이 있으면 200 반환 후 폐기
- rate limit: IP당 5건/시간 (429)
- 성공 시 운영자 이메일 발송, `{ ok: true }`

## 3. URL 계약 (SEO — 안정성 보장 필요)

| 경로 | 렌더링 | 내용 |
|---|---|---|
| `/` | SSR 셸 + 클라이언트 지도 | 지도 홈 |
| `/guide` | SSG+revalidate | 요일별 배출제 안내 (시별 탭, 오늘 강조) |
| `/guide/faq` | SSG | FAQ (JSON-LD FAQPage) |
| `/recycle-center` | SSG+revalidate | 재활용도움센터 소개·전체 목록 |
| `/recycle-center/[id]` | SSG+revalidate | 개별 상세 (78개) |
| `/clean-house/[district]/[emd]` | SSG+revalidate | 읍면동 묶음 페이지 (~40+) |
| `/sitemap.xml`, `/robots.txt` | 동적 생성 | 전 콘텐츠 URL 나열 |
| `/manifest.webmanifest` | 정적 생성 | PWA 매니페스트 (standalone, maskable 아이콘) |
| `/.well-known/assetlinks.json` | 정적 | Android TWA Digital Asset Links (서명 키 SHA-256) |

`[id]`와 `[emd]`는 Site.id / 읍면동 슬러그 — 수집 간 불변이어야 하며, 페이지 삭제 시 301 정책을 plan에 따라 적용한다.

## 4. 운영 계약 (홈서버)

- 웹: systemd `clean-jeju.service` — `next start` (standalone), 포트는 배포 시 확정, cloudflared 라우트 연결
- 파이프라인: systemd `clean-jeju-pipeline.{service,timer}` — 주 1회, 성공 시 `/api/revalidate` 호출, 실패 시 이메일 리포트
- 시크릿: 공공데이터포털 서비스 키, Resend 키, revalidate 토큰 — `~/deploy` SOPS 체계로 관리, `.env`로 주입
