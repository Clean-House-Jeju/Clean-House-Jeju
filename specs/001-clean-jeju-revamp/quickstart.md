# Quickstart: Clean Jeju v2

## 사전 준비 (1회, 사용자 액션 필요)

1. **공공데이터포털 서비스 키**: data.go.kr 로그인 → `15110514`(제주시 클린하우스) 등 활용신청 → 발급 키를 `.env`의 `DATA_GO_KR_KEY`로
2. **카카오 개발자 콘솔**: 앱의 웹 플랫폼에 배포 도메인(서브도메인) + `http://localhost:3000` 등록
3. **시크릿**: `web/.env.local` — `KAKAO_JS_KEY`, `RESEND_API_KEY`, `REVALIDATE_TOKEN`, `REPORT_TO_EMAIL` (서버 배포본은 `~/deploy` SOPS 체계에서 주입)

## 로컬 개발

```bash
pnpm install                     # 루트 워크스페이스 (npm은 workspace 이슈 있음 — pnpm 사용)

# 1) 데이터 생성 (최초 1회 또는 갱신 시)
pnpm --filter pipeline run collect        # data/*.json 생성 + 검증 리포트

# 2) 웹 개발 서버
pnpm --filter web dev                     # http://localhost:3000
```

## 테스트

```bash
pnpm --filter pipeline test               # 실 API 통합 테스트 포함
pnpm --filter web test                    # 단위 (Vitest)
pnpm --filter web e2e                     # Playwright (권한 3경로·JS-off·모바일 뷰포트)
```

## 홈서버 배포

```bash
# 홈서버에서 (Node v22, nvm)
git pull && pnpm install && pnpm --filter web build   # standalone output

# systemd (sudo는 사용자 직접 실행)
sudo cp deploy/clean-jeju.service deploy/clean-jeju-pipeline.{service,timer} /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now clean-jeju.service clean-jeju-pipeline.timer
```

- cloudflared 라우트 추가는 Cloudflare API로 (로컬 config.yml은 무시됨 — 홈서버 지식 베이스 참조)
- 파이프라인 타이머는 **UTC 기준**으로 작성 (홈서버 TZ=Etc/UTC — KST 아님 주의)
- 배포 후 검증: 실도메인에서 Playwright E2E + Lighthouse 실행, Search Console에 sitemap 제출

## 데이터만 갱신될 때 (평상시 운영)

파이프라인 타이머가 주 1회: 수집 → 검증 → `data/*.json` 원자적 교체 →
`POST /api/revalidate` → 화면 기준일 갱신. 실패 시 기존 데이터 유지 + 이메일 리포트.
