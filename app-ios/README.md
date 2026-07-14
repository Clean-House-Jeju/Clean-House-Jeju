# 클린 제주 iOS (Expo 웹뷰 래퍼)

maeil-app과 동일한 툴체인(Expo SDK 54, EAS, owner `ighost-p`)의 iOS 배포용 래퍼.
웹(`https://jejucleanhouse.com`)을 WKWebView로 감싸되, 심사(4.2 최소 기능성) 방어를 위한
네이티브 처리를 포함한다.

## 포함된 네이티브 처리 (심사 방어 세트)

- 네이티브 스플래시/아이콘 (브랜드 자산)
- 오프라인 감지(NetInfo) → 네이티브 오프라인 화면 + 재시도
- 외부 링크(카카오맵·tel·mailto)는 시스템 앱으로 위임
- 뒤로가기 스와이프 제스처, pull-to-refresh, safe-area
- WKWebView geolocation (NSLocationWhenInUseUsageDescription)
- **배출일 로컬 알림 (T040)** — expo-notifications 주간 예약 알림. 배출제는 고정
  주간 로테이션이라 서버 푸시 불필요: 웹 벨 버튼 → 브리지(`cj-push-toggle`) →
  권한 요청 후 `/api/notify-schedule`을 받아 요일별 알림 7개(15:00 KST) 예약.
  앱 실행 시마다 재동기화(규칙 개편 자동 반영), 켜짐 여부 = 예약 존재 여부.

**로드맵**: 홈 위젯(WidgetKit) 검토.

## 개발

```bash
cd app-ios
npm install   # ⚠️ pnpm 금지 — 루트 워크스페이스와 충돌 (EAS 빌드도 npm 사용)
EXPO_PUBLIC_WEB_URL=http://<맥IP>:8080 pnpm start   # Expo Go로 실기기 테스트
```

## 빌드·배포 (EAS)

```bash
npx eas init                # 최초 1회 — ighost-p 계정에 프로젝트 생성 (projectId가 app.json에 기록됨)
pnpm build:ios              # production 빌드 (자동 버전 증가)
pnpm submit:ios             # App Store Connect 업로드 → TestFlight → 심사 제출
```

- 번들 ID: `dev.swyang.cleanjeju`
- 웹 URL은 `eas.json`의 `EXPO_PUBLIC_WEB_URL`로 프로필별 주입
- Android(같은 코드로 가능)는 Play 계정 확보 후 — 그 전까지는 웹 PWA/TWA 경로 유지

## 심사 제출 시 메모

- 심사 노트에 위치 권한 사용 이유(주변 클린하우스 탐색)와 오프라인 동작을 명시
- 계정 없이 전 기능 사용 가능(로그인 없음) — 데모 계정 불필요
- 리젝(4.2) 시 1순위 대응: 네이티브 푸시 + 즐겨찾기 위젯 추가 후 재제출
