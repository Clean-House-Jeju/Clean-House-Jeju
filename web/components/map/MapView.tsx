"use client";

import { Banner, EmptyState, Spinner } from "@astryxdesign/core";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import TodayBanner from "@/components/home/TodayBanner";
import { CloseIcon, MoonIcon, SearchIcon, TargetIcon } from "@/components/icons";
import Logo from "@/components/Logo";
import { DEFAULT_CENTER, distanceKm, formatDistance, isInJeju } from "@/lib/geo";
import { formatHours, isOpen, withRuleHours } from "@/lib/status";
import type { DisposalRule, MapSite, SiteType } from "@/lib/types";
import { type KakaoNS, loadKakaoMaps } from "./kakao-loader";
import { useGeolocation } from "./useGeolocation";
import styles from "./MapView.module.css";

type Filter = "all" | SiteType;

const TYPE_LABEL: Record<SiteType, string> = { clean: "클린하우스", recycle: "재활용도움센터" };
const FILTERS: { value: Filter; label: string; icon?: string }[] = [
	{ value: "all", label: "전체" },
	{ value: "clean", label: "클린하우스", icon: "/markers/clean-open.svg" },
	{ value: "recycle", label: "도움센터", icon: "/markers/recycle-open.svg" },
];
// 레거시 클러스터 파라미터 계승 (research R5)
const CLUSTER_PARAMS: Record<SiteType, { gridSize: number }> = {
	clean: { gridSize: 100 },
	recycle: { gridSize: 150 },
};

const CLUSTER_STYLE_BASE = {
	color: "#ffffff",
	fontWeight: "700",
	textAlign: "center",
	borderRadius: "50%",
	border: "2.5px solid rgba(255,255,255,0.92)",
} as const;

function clusterStyles(type: SiteType) {
	const bg =
		type === "clean"
			? "radial-gradient(circle at 32% 28%, #2ebd93, #0d7d5e)"
			: "radial-gradient(circle at 32% 28%, #6a71e3, #3b41a3)";
	const shadow =
		type === "clean" ? "0 4px 14px rgba(13,125,94,0.45)" : "0 4px 14px rgba(59,65,163,0.45)";
	return [40, 50, 62].map((size, i) => ({
		...CLUSTER_STYLE_BASE,
		width: `${size}px`,
		height: `${size}px`,
		lineHeight: `${size - 5}px`,
		fontSize: `${13 + i * 2}px`,
		background: bg,
		boxShadow: shadow,
	}));
}

interface MarkerEntry {
	site: MapSite;
	marker: KakaoNS;
}

export default function MapView({ rules, asOf }: { rules: DisposalRule[]; asOf: string }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<KakaoNS>(null);
	const kakaoRef = useRef<KakaoNS>(null);
	const markersRef = useRef<Record<SiteType, MarkerEntry[]>>({ clean: [], recycle: [] });
	const clusterersRef = useRef<Record<SiteType, KakaoNS>>({ clean: null, recycle: null });
	const overlayRef = useRef<KakaoNS>(null);
	const meMarkerRef = useRef<KakaoNS>(null);

	const [sites, setSites] = useState<MapSite[]>([]);
	const [mapError, setMapError] = useState<string | null>(null);
	const [mapReady, setMapReady] = useState(false);
	const [filter, setFilter] = useState<Filter>("all");
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState<MapSite | null>(null);
	const [chipEl, setChipEl] = useState<HTMLDivElement | null>(null);
	const geo = useGeolocation();

	const openState = useCallback(
		(site: MapSite): boolean | undefined => isOpen(withRuleHours(site, rules)),
		[rules],
	);

	useEffect(() => {
		fetch("/api/map-sites")
			.then((r) => r.json())
			.then((body: { sites: MapSite[] }) => setSites(body.sites))
			.catch(() => setMapError("데이터를 불러오지 못했습니다. 잠시 후 새로고침해 주세요."));
	}, []);

	// 지도 초기화 (1회)
	useEffect(() => {
		let cancelled = false;
		loadKakaoMaps()
			.then((kakao) => {
				if (cancelled || !containerRef.current) return;
				kakaoRef.current = kakao;
				const map = new kakao.maps.Map(containerRef.current, {
					center: new kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
					level: 8,
				});
				mapRef.current = map;
				for (const type of ["clean", "recycle"] as const) {
					// 클러스터러는 유형별 1회만 생성 (레거시의 루프 내 재생성 버그 재발 금지)
					clusterersRef.current[type] = new kakao.maps.MarkerClusterer({
						map,
						averageCenter: true,
						minLevel: 5,
						gridSize: CLUSTER_PARAMS[type].gridSize,
						calculator: [10, 100],
						styles: clusterStyles(type),
					});
				}
				// 선택 마커 식별 칩 오버레이
				const el = document.createElement("div");
				overlayRef.current = new kakao.maps.CustomOverlay({ content: el, yAnchor: 1, zIndex: 30 });
				setChipEl(el);
				kakao.maps.event.addListener(map, "click", () => setSelected(null));
				setMapReady(true);
			})
			.catch((e: Error) => setMapError(e.message));
		return () => {
			cancelled = true;
		};
	}, []);

	// 선택 칩 표시/숨김
	useEffect(() => {
		const overlay = overlayRef.current;
		const kakao = kakaoRef.current;
		const map = mapRef.current;
		if (!overlay || !kakao || !map) return;
		if (selected) {
			overlay.setPosition(new kakao.maps.LatLng(selected.lat, selected.lng));
			overlay.setMap(map);
		} else {
			overlay.setMap(null);
		}
	}, [selected]);

	// 마커 구성 — 운영 상태별 이미지 (레거시 active/비활성 마커 시스템 계승)
	useEffect(() => {
		const kakao = kakaoRef.current;
		const map = mapRef.current;
		if (!mapReady || !kakao || !map || sites.length === 0) return;

		const imageSize = new kakao.maps.Size(34, 44);
		const imageCache = new Map<string, KakaoNS>();
		const imageFor = (type: SiteType, open: boolean | undefined) => {
			const src = `/markers/${type}-${open === false ? "closed" : "open"}.svg`;
			if (!imageCache.has(src)) imageCache.set(src, new kakao.maps.MarkerImage(src, imageSize));
			return imageCache.get(src);
		};

		for (const type of ["clean", "recycle"] as const) {
			const entries: MarkerEntry[] = sites
				.filter((s) => s.type === type)
				.map((site) => {
					const marker = new kakao.maps.Marker({
						position: new kakao.maps.LatLng(site.lat, site.lng),
						title: site.name,
						image: imageFor(type, openState(site)),
					});
					kakao.maps.event.addListener(marker, "click", () => {
						setSelected(site);
						map.panTo(new kakao.maps.LatLng(site.lat, site.lng));
					});
					return { site, marker };
				});
			markersRef.current[type] = entries;
		}
		applyFilter(filter);
		// biome-ignore lint/correctness/useExhaustiveDependencies: 마커는 sites 확정 후 1회만 구성
	}, [mapReady, sites]);

	const applyFilter = useCallback((next: Filter) => {
		for (const type of ["clean", "recycle"] as const) {
			const clusterer = clusterersRef.current[type];
			if (!clusterer) continue;
			clusterer.clear();
			if (next === "all" || next === type) {
				clusterer.addMarkers(markersRef.current[type].map((e) => e.marker));
			}
		}
	}, []);

	const handleFilter = (next: Filter) => {
		setFilter(next);
		applyFilter(next);
		setSelected(null);
	};

	// 현위치 마커 이동/생성
	const showMe = useCallback((lat: number, lng: number, pan: boolean) => {
		const kakao = kakaoRef.current;
		const map = mapRef.current;
		if (!kakao || !map) return;
		const pos = new kakao.maps.LatLng(lat, lng);
		if (!meMarkerRef.current) {
			meMarkerRef.current = new kakao.maps.Marker({
				map,
				position: pos,
				image: new kakao.maps.MarkerImage("/markers/me.svg", new kakao.maps.Size(36, 36)),
				zIndex: 9,
			});
		} else {
			meMarkerRef.current.setPosition(pos);
		}
		if (pan) {
			map.setLevel(5);
			map.panTo(pos);
		}
	}, []);

	// 초기 위치 반영 (허용 + 제주 안일 때만 이동 — FR-007)
	useEffect(() => {
		if (!mapReady) return;
		if (geo.status === "granted" && geo.inJeju) showMe(geo.lat, geo.lng, true);
	}, [mapReady, geo, showMe]);

	// 현위치 FAB
	const locateMe = () => {
		navigator.geolocation?.getCurrentPosition(
			(pos) => {
				const { latitude, longitude } = pos.coords;
				if (isInJeju(latitude, longitude)) showMe(latitude, longitude, true);
			},
			() => {},
			{ timeout: 5000, maximumAge: 30_000 },
		);
	};

	const origin = geo.status === "granted" ? { lat: geo.lat, lng: geo.lng } : DEFAULT_CENTER;

	const results = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return [];
		return sites
			.filter((s) => filter === "all" || s.type === filter)
			.filter(
				(s) =>
					s.name.toLowerCase().includes(q) ||
					s.address.toLowerCase().includes(q) ||
					s.emd.toLowerCase().includes(q),
			)
			.map((s) => ({ site: s, dist: distanceKm(origin.lat, origin.lng, s.lat, s.lng) }))
			.sort((a, b) => a.dist - b.dist)
			.slice(0, 30);
	}, [query, sites, filter, origin.lat, origin.lng]);

	const focusSite = (site: MapSite) => {
		const kakao = kakaoRef.current;
		const map = mapRef.current;
		if (kakao && map) {
			map.setLevel(4);
			map.panTo(new kakao.maps.LatLng(site.lat, site.lng));
		}
		setSelected(site);
		setQuery("");
	};

	const selectedOpen = selected ? openState(selected) : undefined;
	const selectedHours = selected ? withRuleHours(selected, rules) : null;

	return (
		<div className={styles.wrap}>
			{/* 풀블리드 지도 */}
			<div ref={containerRef} className={styles.map} role="application" aria-label="제주 배출 장소 지도" />
			{!mapReady && !mapError && (
				<div className={styles.mapFallback}>
					<Spinner aria-label="지도 로딩 중" />
				</div>
			)}
			{mapError && (
				<div className={styles.mapFallback}>
					<Banner status="warning" title="지도를 불러올 수 없습니다" description={mapError} />
				</div>
			)}

			{/* 플로팅 상단 레이어 */}
			<div className={styles.top}>
				<div className={styles.topRow}>
					<span className={styles.brand}>
						<Logo size={24} />
					</span>
					<label className={styles.search}>
						<SearchIcon />
						<input
							type="search"
							placeholder="명칭·주소·읍면동 검색"
							aria-label="클린하우스·재활용도움센터 검색"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
						{query !== "" && (
							<button type="button" aria-label="검색어 지우기" onClick={() => setQuery("")}>
								<CloseIcon size={14} />
							</button>
						)}
					</label>
					<nav className={styles.deskNav} aria-label="주 메뉴">
						<Link href="/guide">배출 안내</Link>
						<Link href="/recycle-center">도움센터</Link>
						<Link href="/clean-house">클린하우스</Link>
					</nav>
				</div>

				<div className={styles.chips}>
					<div className={styles.filterGroup} role="radiogroup" aria-label="유형 필터">
						{FILTERS.map((f) => (
							<button
								key={f.value}
								type="button"
								role="radio"
								aria-checked={filter === f.value}
								className={styles.filterPill}
								data-active={filter === f.value}
								onClick={() => handleFilter(f.value)}
							>
								{f.icon && <img src={f.icon} alt="" width={12} height={16} />}
								{f.label}
							</button>
						))}
					</div>
				</div>

				{query.trim() !== "" && (
					<div className={styles.results}>
						{results.length === 0 ? (
							<EmptyState title="검색 결과가 없습니다" description="다른 검색어로 시도해 보세요." />
						) : (
							results.map(({ site, dist }) => {
								const open = openState(site);
								return (
									<button key={site.id} type="button" className={styles.resultItem} onClick={() => focusSite(site)}>
										<img
											src={`/markers/${site.type}-${open === false ? "closed" : "open"}.svg`}
											alt=""
											width={22}
											height={28}
										/>
										<span className={styles.resultBody}>
											<span className={styles.resultName}>{site.name}</span>
											<span className={styles.resultMeta}>
												{TYPE_LABEL[site.type]} · {site.emd} · {site.address}
											</span>
										</span>
										<span className={styles.resultDist}>{formatDistance(dist)}</span>
									</button>
								);
							})
						)}
					</div>
				)}
			</div>

			{/* 현위치 FAB */}
			<button type="button" className={styles.locate} onClick={locateMe} aria-label="내 위치로 이동">
				<TargetIcon />
			</button>

			{/* 오늘 배출 바 — 하단 상시 노출, 개소 선택 시 카드에 양보 */}
			{!selected && (
				<div className={styles.todayBar}>
					<TodayBanner rules={rules} asOf={asOf} />
				</div>
			)}

			{geo.status === "granted" && !geo.inJeju && (
				<div className={styles.notice}>
					<Banner status="info" title="제주 외 지역에서 접속 중" description="지도는 제주 기본 화면으로 표시됩니다." />
				</div>
			)}

			{/* 선택 마커 식별 칩 */}
			{chipEl &&
				selected &&
				createPortal(
					<div className={styles.markerChip} data-type={selected.type}>
						{selected.name}
					</div>,
					chipEl,
				)}

			{/* 다크 정보 카드 */}
			{selected && selectedHours && (
				<article className={styles.card} data-type={selected.type}>
					<button type="button" className={styles.cardClose} onClick={() => setSelected(null)} aria-label="닫기">
						<CloseIcon size={15} />
					</button>
					<div className={styles.cardBody}>
						<span className={styles.cardThumb} data-type={selected.type}>
							<img src={`/markers/${selected.type}-open.svg`} alt="" width={26} height={34} />
						</span>
						<div className={styles.cardInfo}>
							<p className={styles.cardTags}>
								#{TYPE_LABEL[selected.type]} #{selected.emd}
							</p>
							<h3 className={styles.cardName}>{selected.name}</h3>
							<div className={styles.cardBadges}>
								<span className={styles.cardStatus} data-open={selectedOpen ?? "unknown"}>
									{selectedOpen === undefined ? (
										"운영정보 없음"
									) : selectedOpen ? (
										<>
											<span className={styles.statusPulse} /> 운영중
										</>
									) : (
										<>
											<MoonIcon size={11} /> 운영마감
										</>
									)}
								</span>
								<span className={styles.cardMeta}>
									{formatHours(selectedHours)} · {formatDistance(distanceKm(origin.lat, origin.lng, selected.lat, selected.lng))}
								</span>
							</div>
						</div>
					</div>
					<footer className={styles.cardActions}>
						<a
							className={styles.cardPrimary}
							data-type={selected.type}
							href={`https://map.kakao.com/link/to/${encodeURIComponent(selected.name)},${selected.lat},${selected.lng}`}
							target="_blank"
							rel="noreferrer"
						>
							카카오맵 길찾기
						</a>
						{selected.type === "recycle" ? (
							<a className={styles.cardSecondary} href={`/recycle-center/${selected.id}`}>
								상세 정보
							</a>
						) : (
							<a className={styles.cardSecondary} href={`/report?site=${selected.id}`}>
								정보 제보
							</a>
						)}
					</footer>
				</article>
			)}
		</div>
	);
}
