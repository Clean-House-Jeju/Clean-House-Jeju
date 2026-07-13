"use client";

import {
	Badge,
	Banner,
	Button,
	Card,
	EmptyState,
	Heading,
	SegmentedControl,
	SegmentedControlItem,
	Spinner,
	Text,
	TextInput,
} from "@astryxdesign/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_CENTER, distanceKm, formatDistance } from "@/lib/geo";
import { formatHours, isOpen } from "@/lib/status";
import type { MapSite, SiteType } from "@/lib/types";
import { type KakaoNS, loadKakaoMaps } from "./kakao-loader";
import { useGeolocation } from "./useGeolocation";
import styles from "./MapView.module.css";

type Filter = "all" | SiteType;

const TYPE_LABEL: Record<SiteType, string> = { clean: "클린하우스", recycle: "재활용도움센터" };
const MARKER_IMG: Record<SiteType, string> = { clean: "/markers/clean.svg", recycle: "/markers/recycle.svg" };
// 레거시 클러스터 파라미터 계승 (research R5)
const CLUSTER_PARAMS: Record<SiteType, { gridSize: number }> = {
	clean: { gridSize: 100 },
	recycle: { gridSize: 150 },
};

interface MarkerEntry {
	site: MapSite;
	marker: KakaoNS;
}

export default function MapView() {
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

	// 데이터 로드
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

	// 마커 구성 (사이트 로드 후 1회)
	useEffect(() => {
		const kakao = kakaoRef.current;
		const map = mapRef.current;
		if (!mapReady || !kakao || !map || sites.length === 0) return;

		for (const type of ["clean", "recycle"] as const) {
			const imageSize = new kakao.maps.Size(24, 35);
			const image = new kakao.maps.MarkerImage(MARKER_IMG[type], imageSize);
			const entries: MarkerEntry[] = sites
				.filter((s) => s.type === type)
				.map((site) => {
					const marker = new kakao.maps.Marker({
						position: new kakao.maps.LatLng(site.lat, site.lng),
						title: site.name,
						image,
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
		// eslint 대응: applyFilter는 ref 기반이라 안정적
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
				image: new kakao.maps.MarkerImage("/markers/me.svg", new kakao.maps.Size(34, 46)),
				zIndex: 9,
			});
			map.setCenter(pos);
			map.setLevel(5);
		}
	}, [mapReady, geo]);

	const origin = geo.status === "granted" ? { lat: geo.lat, lng: geo.lng } : DEFAULT_CENTER;

	// 검색 결과 (명칭+주소+읍면동, 거리순 — FR-008)
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
		setQuery(""); // 결과 리스트를 닫아 상세 카드가 가려지지 않게
	};

	const selectedOpen = selected ? isOpen(selected) : undefined;

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
						results.map(({ site, dist }) => (
							<button key={site.id} type="button" className={styles.resultItem} onClick={() => focusSite(site)}>
								<Text weight="medium">{site.name}</Text>
								<Text size="sm" color="secondary">
									{TYPE_LABEL[site.type]} · {formatDistance(dist)} · {site.address}
								</Text>
							</button>
						))
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

			{geo.status === "granted" && !geo.inJeju && (
				<div className={styles.notice}>
					<Banner status="info" title="제주 외 지역에서 접속 중" description="지도는 제주 기본 화면으로 표시됩니다." />
				</div>
			)}

			{selected && (
				<div className={styles.detail}>
					<Card>
						<Heading level={3}>{selected.name}</Heading>
						<div className={styles.badges}>
							<Badge label={TYPE_LABEL[selected.type]} />
							{selectedOpen !== undefined && (
								<Badge label={selectedOpen ? "운영중" : "운영시간 아님"} variant={selectedOpen ? "success" : "neutral"} />
							)}
						</div>
						<Text>{selected.address}</Text>
						<Text size="sm" color="secondary">
							{formatHours(selected)} · {formatDistance(distanceKm(origin.lat, origin.lng, selected.lat, selected.lng))}
						</Text>
						<div className={styles.actions}>
							<Button
								label="카카오맵 길찾기"
								href={`https://map.kakao.com/link/to/${encodeURIComponent(selected.name)},${selected.lat},${selected.lng}`}
								target="_blank"
								rel="noreferrer"
							/>
							<Button label="닫기" variant="secondary" clickAction={() => setSelected(null)} />
						</div>
					</Card>
				</div>
			)}
		</div>
	);
}
