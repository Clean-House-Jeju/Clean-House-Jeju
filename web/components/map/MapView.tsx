"use client";

import { Banner, EmptyState, SegmentedControl, SegmentedControlItem, Spinner, TextInput } from "@astryxdesign/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_CENTER, distanceKm, formatDistance } from "@/lib/geo";
import { formatHours, isOpen, withRuleHours } from "@/lib/status";
import type { DisposalRule, MapSite, SiteType } from "@/lib/types";
import { CloseIcon, MoonIcon } from "@/components/icons";
import { type KakaoNS, loadKakaoMaps } from "./kakao-loader";
import { useGeolocation } from "./useGeolocation";
import styles from "./MapView.module.css";

type Filter = "all" | SiteType;

const TYPE_LABEL: Record<SiteType, string> = { clean: "클린하우스", recycle: "재활용도움센터" };
// 레거시 클러스터 파라미터 계승 (research R5)
const CLUSTER_PARAMS: Record<SiteType, { gridSize: number }> = {
	clean: { gridSize: 100 },
	recycle: { gridSize: 150 },
};

// 타입별 클러스터 배지 — 레거시 SVG 배지의 투톤 아이덴티티를 CSS로 재해석
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

export default function MapView({ rules }: { rules: DisposalRule[] }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<KakaoNS>(null);
	const kakaoRef = useRef<KakaoNS>(null);
	const markersRef = useRef<Record<SiteType, MarkerEntry[]>>({ clean: [], recycle: [] });
	const clusterersRef = useRef<Record<SiteType, KakaoNS>>({ clean: null, recycle: null });

	const [sites, setSites] = useState<MapSite[]>([]);
	const [mapError, setMapError] = useState<string | null>(null);
	const [mapReady, setMapReady] = useState(false);
	const [filter, setFilter] = useState<Filter>("all");
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState<MapSite | null>(null);
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
				kakao.maps.event.addListener(map, "click", () => setSelected(null));
				setMapReady(true);
			})
			.catch((e: Error) => setMapError(e.message));
		return () => {
			cancelled = true;
		};
	}, []);

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

	// 현위치 반영 (허용 + 제주 안일 때만 이동 — FR-007)
	useEffect(() => {
		const kakao = kakaoRef.current;
		const map = mapRef.current;
		if (!mapReady || !kakao || !map) return;
		if (geo.status === "granted" && geo.inJeju) {
			const pos = new kakao.maps.LatLng(geo.lat, geo.lng);
			new kakao.maps.Marker({
				map,
				position: pos,
				image: new kakao.maps.MarkerImage("/markers/me.svg", new kakao.maps.Size(36, 36)),
				zIndex: 9,
			});
			map.setCenter(pos);
			map.setLevel(5);
		}
	}, [mapReady, geo]);

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
			<div className={styles.controls}>
				<TextInput
					label="클린하우스·재활용도움센터 검색"
					isLabelHidden
					placeholder="명칭·주소·읍면동 검색"
					value={query}
					onChange={(v: string) => setQuery(v)}
					hasClear
				/>
				<SegmentedControl label="유형 필터" value={filter} onChange={(v: string) => handleFilter(v as Filter)}>
					<SegmentedControlItem value="all" label="전체" />
					<SegmentedControlItem value="clean" label="클린하우스" />
					<SegmentedControlItem value="recycle" label="도움센터" />
				</SegmentedControl>
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
										className={styles.resultIcon}
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

			<div ref={containerRef} className={styles.map} role="application" aria-label="제주 배출 장소 지도">
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
			</div>

			<div className={styles.legend} aria-hidden>
				<span>
					<img src="/markers/clean-open.svg" alt="" width={15} height={19} /> 클린하우스
				</span>
				<span>
					<img src="/markers/recycle-open.svg" alt="" width={15} height={19} /> 도움센터
				</span>
				<span>
					<span className={`cj-dot ${styles.legendDot}`} /> 운영마감
				</span>
			</div>

			{geo.status === "granted" && !geo.inJeju && (
				<div className={styles.notice}>
					<Banner status="info" title="제주 외 지역에서 접속 중" description="지도는 제주 기본 화면으로 표시됩니다." />
				</div>
			)}

			{selected && selectedHours && (
				<article className={styles.card} data-type={selected.type}>
					<header className={styles.cardHead}>
						<span className={styles.cardType}>{TYPE_LABEL[selected.type]}</span>
						<span className={styles.cardStatus} data-open={selectedOpen ?? "unknown"}>
							{selectedOpen === undefined ? (
								"운영정보 없음"
							) : selectedOpen ? (
								<>
									<span className={styles.statusPulse} /> 운영중
								</>
							) : (
								<>
									<MoonIcon /> 운영마감
								</>
							)}
						</span>
						<button type="button" className={styles.cardClose} onClick={() => setSelected(null)} aria-label="닫기">
							<CloseIcon />
						</button>
					</header>
					<div className={styles.cardBody}>
						<img
							className={styles.cardIcon}
							src={`/markers/${selected.type}-open.svg`}
							alt=""
							width={34}
							height={44}
						/>
						<div className={styles.cardInfo}>
							<h3 className={styles.cardName}>{selected.name}</h3>
							<p className={styles.cardAddr}>{selected.address}</p>
							<p className={styles.cardMeta}>
								{formatHours(selectedHours)} ·{" "}
								{formatDistance(distanceKm(origin.lat, origin.lng, selected.lat, selected.lng))}
							</p>
						</div>
					</div>
					<footer className={styles.cardActions}>
						<a
							className={styles.cardPrimary}
							href={`https://map.kakao.com/link/to/${encodeURIComponent(selected.name)},${selected.lat},${selected.lng}`}
							target="_blank"
							rel="noreferrer"
						>
							카카오맵 길찾기
						</a>
						{selected.type === "recycle" && (
							<a className={styles.cardSecondary} href={`/recycle-center/${selected.id}`}>
								상세 정보
							</a>
						)}
					</footer>
				</article>
			)}
		</div>
	);
}
