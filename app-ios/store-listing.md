# App Store 등록 정보 (초안)

## 기본

- **앱 이름**: 클린 제주
- **부제(Subtitle, 30자)**: 제주 분리배출 지도 · 오늘 버릴 것
- **번들 ID**: dev.swyang.cleanjeju
- **카테고리**: 유틸리티 (보조: 라이프스타일)
- **연령 등급**: 4+
- **개인정보처리방침 URL**: https://jejucleanhouse.com/privacy
- **지원 URL**: https://jejucleanhouse.com/guide/faq
- **마케팅 URL**: https://jejucleanhouse.com
- **저작권**: © Clean-House-Jeju

## 프로모션 텍스트 (170자)

오늘 제주에서 뭘 버릴 수 있는지 3초 만에 확인하세요. 내 주변 클린하우스·재활용도움센터 1,800곳의 위치와 운영 상태, 요일별 배출제를 한 화면에서.

## 설명

제주 재활용품 요일별 배출제, 매번 헷갈리시죠?
클린 제주는 제주시·서귀포시 공공데이터를 매주 자동 갱신해 가장 정확한 배출 정보를 알려드립니다.

주요 기능
• 오늘 버릴 수 있는 재활용품을 첫 화면에서 바로 확인 (제주시/서귀포시 구분)
• 내 주변 클린하우스 1,600여 곳 · 재활용도움센터 179곳 지도 — 운영중/마감 상태 표시
• "지금 열린 곳" 원탭 — 지금 운영 중인 가장 가까운 배출 장소로 즉시 이동
• 분리배출 품목 사전 — 폐건전지, 폐의약품, 대형폐기물… 어디에 버리는지 검색
• 즐겨찾기 — 우리 집 클린하우스를 저장하고 운영 상태 바로 확인
• 배출일 알림 — 매일 오후 3시(배출 시작)에 오늘 품목 푸시
• 카카오맵 길찾기 연동, 재활용도움센터 상세 정보(보상수거·폐가전 등 서비스)

데이터 출처: 공공데이터포털(data.go.kr) 제주시·서귀포시 클린하우스 및 제주특별자치도 재활용도움센터 현황 (주 1회 자동 갱신, 화면에 기준일 표시)

## 키워드 (100자)

제주,쓰레기,분리수거,분리배출,클린하우스,재활용,재활용도움센터,요일별배출제,제주시,서귀포

## 심사 노트 (App Review Information)

- 로그인 없이 전 기능 사용 가능합니다 (데모 계정 불필요).
- 위치 권한: 사용자 주변의 쓰레기 배출 장소(클린하우스)를 거리순으로 보여주기 위해 사용하며,
  좌표는 기기 내 계산에만 쓰이고 서버로 전송되지 않습니다. 권한 거부 시에도 전 기능 동작합니다.
- 오프라인: 네트워크 없을 때 네이티브 오프라인 화면과 재시도를 제공합니다.
- 본 앱은 제주도 공공데이터 기반의 공익 정보 서비스이며, 웹 콘텐츠에 네이티브 위치·알림·오프라인
  처리를 결합했습니다.

## App Privacy (설문 답변 가이드)

- **수집 데이터**: 없음으로 신고 가능 범위 — 위치는 수집(전송) 안 함(기기 내 사용),
  푸시 토큰은 "User ID 아님·추적 아님". 보수적으로 가려면: "Identifiers → Device ID: 앱 기능,
  사용자와 연결 안 됨, 추적 없음"으로 푸시 엔드포인트 신고.
- **추적(Tracking)**: 없음. 제3자 광고/분석 SDK 없음.

## 스크린샷 ✅ 제작 완료 — `brand/screenshots/framed/` (1290×2796, 5장)

재생성: 웹 dev(:8080) 켠 뒤 `pnpm exec tsx brand/appstore-shots.ts`

### 구성

6.7" (1290×2796) 5장:
1. 지도 홈 — 오늘 배출 바 + 마커 (헤드라인: "오늘 뭘 버릴 수 있는지 3초면 확인")
2. 바텀시트 — 개소 상세 ("운영중인지 바로, 길찾기까지")
3. 내 주변 리스트 ("가까운 순으로 한눈에")
4. 품목 사전 ("폐건전지는 어디에? 검색하면 끝")
5. 배출제 안내 페이지 ("제주시·서귀포시 요일표")

---

## English Localization (영어 탭용)

- **Name**: Clean Jeju
- **Subtitle (30)**: Jeju recycling map & schedule

### Promotional Text (170)

Know what you can throw away in Jeju today — in 3 seconds. 1,800+ clean houses & recycling centers with live open status, all on one map.

### Description

Confused by Jeju's day-of-week recycling schedule? Clean Jeju keeps it simple.

KEY FEATURES
• Today's recyclables at a glance (Jeju-si / Seogwipo-si)
• 1,800+ clean houses & recycling help centers on the map with open/closed status
• "Open now" — one tap to the nearest place that's open
• Waste dictionary — search where batteries, medicine, furniture and more should go
• Favorites — save your neighborhood spot and check its status instantly
• Daily push at 3 PM (disposal start time) with today's items
• KakaoMap directions, center details (rewards, e-waste drop-off and more)

Data: official Jeju public datasets (data.go.kr), auto-updated weekly with the reference date shown in app.

### Keywords (100)

jeju,recycling,waste,trash,clean house,recycle center,schedule,garbage,sorting,korea

### Review Notes (English)

- No login required; all features available immediately (no demo account needed).
- Location permission is used only to sort nearby disposal places by distance;
  coordinates never leave the device. The app is fully functional if denied.
- Native offline screen with retry is provided when the network is unavailable.
- This is a public-interest service built on official Jeju municipal open data,
  combining web content with native location, notification and offline handling.
