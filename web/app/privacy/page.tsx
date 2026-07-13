import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import styles from "../guide/page.module.css";

export const metadata: Metadata = {
	title: "개인정보처리방침",
	description: "클린 제주 서비스의 개인정보 처리에 관한 안내",
	alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
	return (
		<>
			<SiteHeader />
			<main className={styles.main}>
				<h1>개인정보처리방침</h1>
				<p className={styles.lead}>
					클린 제주(이하 "서비스")는 회원가입 없이 사용하는 공익 정보 서비스로, 개인정보 수집을
					최소화합니다. 시행일: 2026-07-13
				</p>

				<section className={styles.district}>
					<h2>1. 위치정보</h2>
					<ul className={styles.notes}>
						<li>내 주변 배출 장소 탐색을 위해 기기의 위치 권한을 요청할 수 있습니다.</li>
						<li>위치 좌표는 <strong>기기 안에서 거리 계산에만 사용</strong>되며, 서버로 전송·저장되지 않습니다.</li>
						<li>권한을 거부해도 지도 중심 기준으로 모든 기능을 사용할 수 있습니다.</li>
					</ul>
				</section>

				<section className={styles.district}>
					<h2>2. 배출일 알림 (푸시)</h2>
					<ul className={styles.notes}>
						<li>알림을 켜면 브라우저가 발급한 <strong>푸시 구독 정보(엔드포인트·암호화 키)</strong>가 서버에 저장됩니다.</li>
						<li>이 정보는 익명이며 배출일 알림 발송에만 사용됩니다. 알림을 끄면 즉시 삭제되고, 만료된 구독은 자동 정리됩니다.</li>
					</ul>
				</section>

				<section className={styles.district}>
					<h2>3. 제보 폼</h2>
					<ul className={styles.notes}>
						<li>제보 내용과 (선택 입력 시) 연락처는 운영자 이메일로 전달되며, 정보 확인·회신 목적 외에 사용하지 않습니다.</li>
						<li>스팸 방지를 위해 요청 IP를 단시간 메모리에서만 계수하며 저장하지 않습니다.</li>
					</ul>
				</section>

				<section className={styles.district}>
					<h2>4. 즐겨찾기 등 로컬 데이터</h2>
					<ul className={styles.notes}>
						<li>즐겨찾기, 방문 횟수, 알림 안내 상태는 <strong>사용자 기기(localStorage)에만</strong> 저장되며 서버로 전송되지 않습니다.</li>
					</ul>
				</section>

				<section className={styles.district}>
					<h2>5. 수집하지 않는 것</h2>
					<ul className={styles.notes}>
						<li>회원가입·로그인이 없으며 이름, 이메일(제보 시 선택 제외), 전화번호 등 신원 정보를 수집하지 않습니다.</li>
						<li>광고·추적 목적의 쿠키나 제3자 분석 도구를 사용하지 않습니다.</li>
					</ul>
				</section>

				<section className={styles.district}>
					<h2>6. 문의</h2>
					<ul className={styles.notes}>
						<li>개인정보 관련 문의: dndb3599@gmail.com 또는 <Link href="/report">제보 폼</Link></li>
					</ul>
				</section>

				<p className={styles.meta}>
					본 방침은 서비스 개선에 따라 갱신될 수 있으며, 변경 시 본 페이지에 공지합니다.
				</p>
			</main>
		</>
	);
}
