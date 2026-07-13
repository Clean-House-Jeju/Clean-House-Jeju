/* 클린 제주 서비스 워커 — 앱 셸 + 데이터 폴백 (FR-022)
 * 의도적으로 경량 (constitution V): 정적 자산 cache-first,
 * 페이지·데이터 network-first + 오프라인 폴백 */

const VERSION = "cj-v2";
// 로컬 개발에서는 캐시를 끄고(dev 번들 오염 방지) 푸시만 동작시킨다
const CACHING = self.location.hostname !== "localhost" && self.location.hostname !== "127.0.0.1";
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;
const DATA_CACHE = `${VERSION}-data`;

const PRECACHE = ["/offline", "/icon-192.png", "/markers/clean-open.svg", "/markers/recycle-open.svg"];

self.addEventListener("install", (e) => {
	e.waitUntil(
		(CACHING ? caches.open(PAGE_CACHE).then((c) => c.addAll(PRECACHE)) : Promise.resolve()).then(() =>
			self.skipWaiting(),
		),
	);
});

// 배출일 푸시 알림
self.addEventListener("push", (e) => {
	let data = { title: "클린 제주", body: "오늘 배출 안내를 확인하세요", url: "/" };
	try {
		data = { ...data, ...e.data.json() };
	} catch {}
	e.waitUntil(
		self.registration.showNotification(data.title, {
			body: data.body,
			icon: "/icon-192.png",
			badge: "/icon-192.png",
			data: { url: data.url },
			tag: "cj-daily",
		}),
	);
});

self.addEventListener("notificationclick", (e) => {
	e.notification.close();
	const url = e.notification.data?.url ?? "/";
	e.waitUntil(
		self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
			const existing = list.find((c) => c.url.includes(self.location.origin));
			return existing ? existing.focus().then(() => existing.navigate(url)) : self.clients.openWindow(url);
		}),
	);
});

self.addEventListener("activate", (e) => {
	e.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
			.then(() => self.clients.claim()),
	);
});

self.addEventListener("fetch", (e) => {
	if (!CACHING) return;
	const url = new URL(e.request.url);
	if (e.request.method !== "GET" || url.origin !== self.location.origin) return;

	// 데이터 API: network-first → 캐시 폴백 (오프라인에서 마지막 데이터)
	if (url.pathname === "/api/map-sites") {
		e.respondWith(
			fetch(e.request)
				.then((res) => {
					const copy = res.clone();
					caches.open(DATA_CACHE).then((c) => c.put(e.request, copy));
					return res;
				})
				.catch(() => caches.match(e.request)),
		);
		return;
	}
	if (url.pathname.startsWith("/api/")) return; // 그 외 API는 SW 미개입

	// 정적 자산: cache-first
	if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/markers/") || /\.(png|svg|woff2?)$/.test(url.pathname)) {
		e.respondWith(
			caches.match(e.request).then(
				(hit) =>
					hit ??
					fetch(e.request).then((res) => {
						const copy = res.clone();
						caches.open(STATIC_CACHE).then((c) => c.put(e.request, copy));
						return res;
					}),
			),
		);
		return;
	}

	// 페이지 내비게이션: network-first → 캐시 → /offline
	if (e.request.mode === "navigate") {
		e.respondWith(
			fetch(e.request)
				.then((res) => {
					const copy = res.clone();
					caches.open(PAGE_CACHE).then((c) => c.put(e.request, copy));
					return res;
				})
				.catch(async () => (await caches.match(e.request)) ?? (await caches.match("/offline"))),
		);
	}
});
