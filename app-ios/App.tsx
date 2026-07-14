import NetInfo from "@react-native-community/netinfo";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { initialWindowMetrics, SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView, type WebViewMessageEvent, type WebViewNavigation } from "react-native-webview";

// 프로덕션 웹 URL — EAS 프로필 env(EXPO_PUBLIC_WEB_URL)로 주입
const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL ?? "https://jejucleanhouse.com";
const WEB_HOST = new URL(WEB_URL).host;

// 외부로 열 호스트/스킴 — 길찾기(카카오맵)·전화·메일 등은 시스템에 위임
const EXTERNAL_SCHEMES = ["tel:", "mailto:", "kakaomap:", "kakaotalk:", "itms-apps:"];

SplashScreen.preventAutoHideAsync().catch(() => {});

// ---- 배출일 로컬 알림 (T040) ----
// 배출제는 고정 주간 로테이션 → 서버 푸시 불필요. /api/notify-schedule을 받아
// 요일별 주간 반복 알림 7개를 기기에 예약한다. 켜짐 여부 = 예약 존재 여부 (별도 저장소 없음).

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowBanner: true,
		shouldShowList: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

type PushState = "on" | "off" | "denied";

async function getPushState(): Promise<PushState> {
	const perm = await Notifications.getPermissionsAsync();
	if (perm.status === "denied" && !perm.canAskAgain) return "denied";
	if (perm.status !== "granted") return "off";
	const scheduled = await Notifications.getAllScheduledNotificationsAsync();
	return scheduled.length > 0 ? "on" : "off";
}

async function syncDisposalSchedule(): Promise<void> {
	const res = await fetch(`${WEB_URL}/api/notify-schedule`);
	if (!res.ok) throw new Error(`notify-schedule ${res.status}`);
	const data = (await res.json()) as {
		hour: number;
		minute: number;
		days: { weekday: number; title: string; body: string }[];
	};
	await Notifications.cancelAllScheduledNotificationsAsync();
	for (const d of data.days) {
		await Notifications.scheduleNotificationAsync({
			content: { title: d.title, body: d.body },
			trigger: {
				type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
				weekday: d.weekday, // 1=일 … 7=토
				hour: data.hour,
				minute: data.minute,
			},
		});
	}
}

function Root() {
	const webRef = useRef<WebView>(null);
	const insets = useSafeAreaInsets();
	// WKWebView는 env(safe-area-inset-*)를 0으로 주는 함정 — 실제 인셋을 CSS 변수로 주입
	const injectSafeArea = `(function(){var s=document.documentElement.style;s.setProperty('--cj-safe-top','${insets.top}px');s.setProperty('--cj-safe-bottom','${insets.bottom}px');})();true;`;
	const [online, setOnline] = useState(true);
	const [failed, setFailed] = useState(false);
	const canGoBack = useRef(false);

	useEffect(() => {
		const sub = NetInfo.addEventListener((state) => {
			setOnline(state.isConnected !== false);
		});
		return () => sub();
	}, []);

	// 앱 시작 시 알림이 켜져 있으면 스케줄 재동기화 — 배출제 개편이 자동 반영된다
	useEffect(() => {
		(async () => {
			try {
				if ((await getPushState()) === "on") await syncDisposalSchedule();
			} catch {
				// 오프라인 등 — 기존 예약 유지
			}
		})();
	}, []);

	// 웹 벨 버튼(NotifyBell) ↔ 네이티브 브리지
	const sendPushState = useCallback(async () => {
		const s = await getPushState();
		webRef.current?.injectJavaScript(
			`window.dispatchEvent(new CustomEvent('cj-push-status',{detail:'${s}'}));true;`,
		);
	}, []);

	const handleMessage = useCallback(
		async (event: WebViewMessageEvent) => {
			let msg: { type?: string };
			try {
				msg = JSON.parse(event.nativeEvent.data);
			} catch {
				return;
			}
			if (msg.type === "cj-push-status") {
				await sendPushState();
			} else if (msg.type === "cj-push-toggle") {
				try {
					const cur = await getPushState();
					if (cur === "on") {
						await Notifications.cancelAllScheduledNotificationsAsync();
					} else if (cur === "off") {
						const perm = await Notifications.requestPermissionsAsync();
						if (perm.status === "granted") await syncDisposalSchedule();
					}
				} catch {
					// 네트워크 실패 등 — 아래에서 실제 상태를 그대로 반영
				}
				await sendPushState();
			}
		},
		[sendPushState],
	);

	// Android 하드웨어 백 버튼 → 웹뷰 히스토리 (iOS는 스와이프 제스처)
	useEffect(() => {
		if (Platform.OS !== "android") return;
		const sub = BackHandler.addEventListener("hardwareBackPress", () => {
			if (canGoBack.current) {
				webRef.current?.goBack();
				return true;
			}
			return false;
		});
		return () => sub.remove();
	}, []);

	const handleNavigation = useCallback((req: WebViewNavigation): boolean => {
		const url = req.url;
		if (EXTERNAL_SCHEMES.some((s) => url.startsWith(s))) {
			Linking.openURL(url).catch(() => {});
			return false;
		}
		try {
			const host = new URL(url).host;
			// 서비스 도메인 밖(카카오맵 웹 길찾기 등)은 시스템 브라우저/앱으로
			if (host !== WEB_HOST) {
				Linking.openURL(url).catch(() => {});
				return false;
			}
		} catch {
			return false;
		}
		return true;
	}, []);

	const reload = () => {
		setFailed(false);
		webRef.current?.reload();
	};

	return (
		<View style={styles.root}>
			<StatusBar style="dark" />
			{!online || failed ? (
				<View style={[styles.offline, { paddingTop: insets.top }]}>
						<Text style={styles.offlineTitle}>{online ? "페이지를 불러올 수 없어요" : "오프라인이에요"}</Text>
						<Text style={styles.offlineBody}>
							네트워크 연결을 확인한 뒤 다시 시도해 주세요.{"\n"}재활용도움센터는 요일 구분 없이 이용할 수
							있어요.
						</Text>
						<Pressable style={styles.retry} onPress={reload}>
							<Text style={styles.retryText}>다시 시도</Text>
						</Pressable>
					</View>
				) : (
					<WebView
						ref={webRef}
						source={{ uri: WEB_URL }}
						style={styles.web}
						// 앱다운 웹뷰 설정
						pullToRefreshEnabled
						allowsBackForwardNavigationGestures
						geolocationEnabled
						domStorageEnabled
						injectedJavaScriptBeforeContentLoaded={injectSafeArea}
						onLoadEnd={() => SplashScreen.hideAsync().catch(() => {})}
						onError={() => setFailed(true)}
						onNavigationStateChange={(nav) => {
							canGoBack.current = nav.canGoBack;
						}}
						onMessage={handleMessage}
						onShouldStartLoadWithRequest={handleNavigation}
						applicationNameForUserAgent={`CleanJejuApp/${Constants.expoConfig?.version ?? "2.0.0"}`}
						// 웹 쪽 하단 safe-area(env)가 동작하도록 인셋 자동 조정 끔
						contentInsetAdjustmentBehavior="never"
					/>
				)}
		</View>
	);
}

export default function App() {
	return (
		<SafeAreaProvider initialMetrics={initialWindowMetrics}>
			<Root />
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	root: { flex: 1, backgroundColor: "#fafcfb" },
	web: { flex: 1 },
	offline: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 32 },
	offlineTitle: { fontSize: 20, fontWeight: "800", color: "#1c2733" },
	offlineBody: { fontSize: 14, lineHeight: 21, color: "#5c6b7a", textAlign: "center" },
	retry: {
		marginTop: 8,
		paddingHorizontal: 22,
		paddingVertical: 12,
		borderRadius: 999,
		backgroundColor: "#12a37a",
	},
	retryText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
