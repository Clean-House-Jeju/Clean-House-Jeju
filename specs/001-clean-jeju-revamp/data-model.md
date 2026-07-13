# Data Model: Clean Jeju v2

**Date**: 2026-07-13 | **Feature**: [spec.md](spec.md)

## Site (배출 장소)

정규화된 단일 스키마. 파이프라인 산출물 `data/sites.json`의 원소.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | string | ✓ | 안정 식별자: `{type}-{관할코드}-{원본키 또는 좌표해시}` — 수집 간 불변이어야 상세 URL이 유지됨 |
| `type` | `"clean" \| "recycle"` | ✓ | 클린하우스 / 재활용도움센터 |
| `name` | string | ✓ | 명칭 (예: "한림2리 재활용도움센터", 클린하우스는 위치 설명) |
| `address` | string | ✓ | 도로명 주소 (없으면 지번) |
| `addressJibun` | string | | 지번 주소 |
| `lat`, `lng` | number | ✓ | WGS84. 제주 bbox(33.19~33.56 / 125.98~127.09) 밖이면 검증 실패 |
| `district` | `"jeju" \| "seogwipo"` | ✓ | 관할 시 — 배출 규칙 결정에 사용 |
| `emd` | string | ✓ | 읍면동 (묶음 페이지 라우팅 키, 예: "한림읍") |
| `openTime`, `closeTime` | string(`HH:mm`) | | 운영 시작/종료. `closeTime < openTime`이면 자정 넘김 |
| `open24h` | boolean | | 24시간 운영 여부 |
| `bins` | object | | 수거함 구성: `{ general, recycle, glass, styrofoam, battery, lamp, food }` (개수, 제주시 데이터만 제공) |
| `cctv` | number | | CCTV 대수 |
| `source` | string | ✓ | 원본 데이터셋 식별 (예: `data.go.kr/15110514`) |

## DisposalRule (배출 규칙)

큐레이션 파일 `data/rules.json`. 조례 개정 시 이 파일만 갱신.

| 필드 | 타입 | 설명 |
|---|---|---|
| `district` | `"jeju" \| "seogwipo"` | 관할 시 |
| `effectiveFrom` | string(date) | 시행일 (예: `2025-06-06`) |
| `source` | string(url) | 고시/안내 페이지 출처 |
| `schedule` | `Record<Day, Item[]>` | 요일(`mon`~`sun`) → 배출 가능 품목 배열 |
| `alwaysAllowed` | Item[] | 요일 무관 배출 품목 (종량제, 음식물 등) |
| `notes` | string[] | 예외·비고 (재활용도움센터는 요일제 미적용 등) |

`Item`: `"plastic" | "paper" | "vinyl" | "nonflammable" | "can-metal" | "styrofoam" | "glass"` (+ 라벨 매핑 테이블)

## Snapshot (수집 메타)

`data/snapshot.json` — 화면의 "데이터 기준일" 및 운영 리포트의 근거.

| 필드 | 타입 | 설명 |
|---|---|---|
| `collectedAt` | string(ISO) | 수집 시각 |
| `sources` | array | 소스별 `{ id, url, fetchedRows, acceptedRows, rejectedRows, status }` |
| `totalSites` | number | 반영 건수 |
| `rejects` | array | 격리 행 요약 (사유·원본 식별자) — 상세는 `data/rejects/` |

## 파생 규칙

- **운영 상태**: 조회 시각 `t`에 대해 `open24h`이거나, 자정 넘김이면 `t ≥ openTime || t < closeTime`, 아니면 `openTime ≤ t < closeTime`
- **오늘 배출 품목**: `district` + 오늘 요일로 `rules.schedule` 조회 (`Asia/Seoul` 기준 — 홈서버 TZ=UTC이므로 반드시 명시적 타임존 변환)
- **읍면동 묶음 페이지**: `sites`를 `district`+`emd`로 그룹핑 → `/clean-house/[district]/[emd]` 정적 경로 생성
- **중복 제거**: 제주시/서귀포시 데이터셋 간 좌표 30m 이내 + 유형 동일 건은 최신 소스 우선
