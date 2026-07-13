# 홈서버 배포 (T032)

## 1. 코드 준비 (swyang, 비대화형)

```bash
cd ~ && git clone https://github.com/Clean-House-Jeju/Clean-House-Jeju.git   # 최초 1회
cd ~/Clean-House-Jeju && git pull
export NVM_DIR=/home/swyang/.nvm; . $NVM_DIR/nvm.sh
pnpm install && pnpm --filter web build
```

## 2. 시크릿 (SOPS 체계 → .env 주입)

`web/.env.production`:

```
NEXT_PUBLIC_SITE_URL=https://<서브도메인>
NEXT_PUBLIC_KAKAO_JS_KEY=<JS 키>          # 빌드 시점에도 필요 (public)
REVALIDATE_TOKEN=<랜덤 토큰>
RESEND_API_KEY=<...>
REPORT_TO_EMAIL=dndb3599@gmail.com
```

`pipeline/.env.production`:

```
KAKAO_REST_KEY=<REST 키>
REVALIDATE_URL=http://127.0.0.1:3005/api/revalidate
REVALIDATE_TOKEN=<위와 동일>
RESEND_API_KEY=<...>
REPORT_TO_EMAIL=dndb3599@gmail.com
```

⚠️ `NEXT_PUBLIC_*`는 빌드 타임 상수 — `.env.production`을 만든 **뒤에** build 할 것.

## 3. systemd (sudo — 사용자 직접)

```bash
sudo cp ~/Clean-House-Jeju/deploy/clean-jeju.service \
        ~/Clean-House-Jeju/deploy/clean-jeju-pipeline.service \
        ~/Clean-House-Jeju/deploy/clean-jeju-pipeline.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now clean-jeju.service clean-jeju-pipeline.timer
systemctl status clean-jeju --no-pager   # 확인
curl -s localhost:3005/api/map-sites | head -c 200
```

## 4. cloudflared 라우트

로컬 config.yml은 무시됨 — Cloudflare API로 라우트 추가 (홈서버 knowledge base
`~/.homelab/knowledge/` 참조). 서브도메인 → `http://localhost:3005`.

## 5. 배포 후 검증 (T033)

```bash
# 로컬 머신에서
cd web && PLAYWRIGHT_BASE_URL=https://<서브도메인> pnpm e2e   # 실도메인 E2E
npx lighthouse https://<서브도메인> --preset=desktop           # SEO ≥ 95 확인
```

- 카카오 콘솔에 서브도메인 등록 필수 (안 하면 지도 로드 실패)
- Search Console 등록 + `https://<서브도메인>/sitemap.xml` 제출 (T034)
- 파이프라인 첫 실행: `sudo systemctl start clean-jeju-pipeline.service` 후
  `journalctl -u clean-jeju-pipeline -n 30`으로 수집 리포트 확인
