# 클린 제주 (Clean Jeju)

제주 클린하우스·재활용도움센터 위치와 **오늘 배출 가능한 재활용품**을 알려주는 서비스입니다.
공공데이터를 주기적으로 자동 수집하므로 항상 최신 정보를 제공합니다.

> v2 전면 개편 (2026): CRA+Redux+정적 스냅샷 → Next.js + Astryx + 자동 데이터 파이프라인.
> 설계 문서는 [specs/001-clean-jeju-revamp/](specs/001-clean-jeju-revamp/) (spec-kit) 참고.

## 기능

- 🗺 지도에서 내 주변 클린하우스(1,400+)·재활용도움센터(78) 찾기 — 운영 상태별 마커
- 📅 요일별 배출제 안내 (제주시/서귀포시, 2025-06-06 개편 반영) — 규칙은 코드가 아닌 [data/rules.json](data/rules.json)
- 🔎 명칭·주소·읍면동 검색 (거리순)
- 📄 SEO 페이지: 배출제 안내·FAQ·재활용도움센터 상세(78)·읍면동별 클린하우스(43)
- 📱 모바일 앱형 UX (하단 탭 바·바텀시트) + PWA 설치 (Android TWA 예정)
- 📨 정보 오류 제보 폼

## 구조

```
web/        Next.js 16 (App Router) + Astryx 디자인시스템 — 서비스 본체
pipeline/   공공데이터 수집·정규화 (주 1회 systemd timer)
data/       파이프라인 산출물 (sites/rules/snapshot/geocache) — git 추적
brand/      마스터 로고 + 자산 생성 스크립트 (sharp)
deploy/     홈서버 systemd 유닛
```

## 개발

```bash
pnpm install
pnpm collect               # 데이터 수집 (공공데이터포털 — 키 불필요)
pnpm dev                   # http://localhost:8080 (카카오 키 등록 포트)
pnpm test && pnpm e2e      # vitest + Playwright
```

`web/.env.local`에 `NEXT_PUBLIC_KAKAO_JS_KEY` 필요 — [web/.env.example](web/.env.example) 참고.
지오코딩(서귀포·도움센터 좌표)은 `KAKAO_REST_KEY` 설정 시 파이프라인이 자동 수행합니다.

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
