import { Badge, Banner, Button, Card, Heading, Text } from "@astryxdesign/core";

// T003 Astryx 스모크 페이지 — Phase 4에서 지도 홈으로 교체 예정
export default function Home() {
	return (
		<main style={{ maxWidth: 640, margin: "0 auto", padding: 24 }}>
			<Heading level={1}>클린 제주</Heading>
			<Text>Astryx SSR 빌드 스모크 테스트</Text>
			<Banner
				status="info"
				title="오늘은 플라스틱 버리는 날"
				description="제주시 기준 · 데이터 기준일 2026-07-13"
			/>
			<Card>
				<Heading level={3}>한림2리 재활용도움센터</Heading>
				<Badge label="운영중" />
				<Text>제주시 한림읍 한림남길 12</Text>
				<Button label="길찾기" />
			</Card>
		</main>
	);
}
