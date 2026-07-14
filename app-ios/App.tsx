import NetInfo from "@react-native-community/netinfo";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { initialWindowMetrics, SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView, type WebViewNavigation } from "react-native-webview";

// 프로덕션 웹 URL — EAS 프로필 env(EXPO_PUBLIC_WEB_URL)로 주입
const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL ?? "https://jejucleanhouse.com";
const WEB_HOST = new URL(WEB_URL).host;

// 외부로 열 호스트/스킴 — 길찾기(카카오맵)·전화·메일 등은 시스템에 위임
const EXTERNAL_SCHEMES = ["tel:", "mailto:", "kakaomap:", "kakaotalk:", "itms-apps:"];

SplashScreen.preventAutoHideAsync().catch(() => {});

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
