# Clean Jeju Constitution

## Core Principles

### I. 데이터 신선도 우선 (Data-Freshness First)
사용자에게 보여주는 모든 정보(개소 위치, 운영시간, 요일별 배출 규칙)는 공공데이터
원본으로부터 자동으로 갱신 가능해야 한다. 배출 요일표·운영시간 등 정책성 데이터를
코드에 하드코딩하는 것을 금지한다 — 정책이 바뀌면 데이터만 갱신하고 배포 없이
반영되어야 한다. 모든 데이터에는 출처와 수집 시각(snapshot date)을 기록하고
화면에 "기준일"을 노출한다.

### II. SEO 가능한 렌더링 (Server-Rendered by Default)
검색 유입이 서비스의 존재 이유 중 하나다. 안내 페이지·개소 상세 페이지 등 콘텐츠성
화면은 정적 생성(SSG/ISR)으로 크롤러가 읽을 수 있어야 하며, 페이지별 메타데이터,
sitemap, 구조화 데이터(JSON-LD)를 갖춘다. 클라이언트 전용 렌더링은 지도 등
상호작용 위젯에 한정한다.

### III. 실동작 검증이 완료 기준 (E2E or It Didn't Happen)
"코드 작성 완료"는 완료가 아니다. 기능의 완료 기준은 실제 데이터·실제 브라우저·실제
배포 환경에서의 동작 확인이다. 데이터 파이프라인은 실제 공공데이터 API 응답으로,
프론트는 실제 빌드 산출물로 검증한다. 외부 연동부는 stub 상태로 완료 선언을 금지한다.

### IV. 기존 의도 존중 (Understand Before Rewrite)
개편 시 기존 코드가 왜 그렇게 작성됐는지(클러스터링 파라미터, 제주 경계 체크,
거리 계산 등 도메인 로직) 먼저 파악하고 보존 가치가 있는 것은 이관한다.
전면 재작성이라도 기존 기능 목록 대비 회귀 체크리스트를 유지한다.

### V. 단순한 운영 (Simple to Operate)
홈서버 1대에서 systemd + cloudflared로 운영 가능한 구조를 유지한다.
배포 단위는 최소화하고(웹 앱 1개 + 데이터 수집 잡 1개), 외부 유료 서비스·복잡한
인프라 의존을 추가하지 않는다. 전역 상태·추상화 계층은 필요가 증명될 때만 도입한다
(YAGNI).

## 기술 스택 제약 (Technology Constraints)

- **프레임워크**: Next.js (App Router, TypeScript)
- **디자인시스템**: Astryx (Meta, React + StyleX 기반) — Beta 단계이므로 도입 전
  Next.js 호환성 검증 필수. 커스텀 스타일은 Astryx 토큰/테마 체계를 따른다.
- **지도**: Kakao Maps JS SDK — 내부(minified) 프로퍼티 접근 금지, 공식 API만 사용
- **데이터 소스**: 공공데이터포털(data.go.kr)·제주데이터허브 등 공식 출처만 사용,
  출처·라이선스를 README에 고지
- **모바일**: 반응형 필수 (모바일 우선), 주요 뷰포트 375px~1440px 검증
- **배포**: 홈서버(systemd 서비스) + cloudflared 터널, HTTPS 필수(geolocation 요건)

## 개발 워크플로우 (Development Workflow)

- spec-kit 기반 SDD: constitution → specify → plan → tasks → implement 순서를 따른다
- 기능 단위 브랜치(`NNN-short-name`)에서 작업, main 머지 전 실동작 검증(원칙 III)
- 데이터 스키마 변경은 파이프라인과 프론트 양쪽의 계약(contract) 문서를 먼저 갱신
- 저장소 위생: IDE 설정·스왑 파일·빌드 산출물 커밋 금지

## Governance

이 constitution은 다른 관행·관성보다 우선한다. 원칙과 충돌하는 구현(하드코딩된
정책 데이터, CSR 전용 콘텐츠 페이지 등)은 리뷰에서 반려한다. 개정은 이 파일의
수정 + 사유 기록으로 하며, 버전은 semver(원칙 추가/삭제 = MINOR, 재정의 = MAJOR,
문구 정리 = PATCH)를 따른다.

**Version**: 1.0.0 | **Ratified**: 2026-07-13 | **Last Amended**: 2026-07-13
