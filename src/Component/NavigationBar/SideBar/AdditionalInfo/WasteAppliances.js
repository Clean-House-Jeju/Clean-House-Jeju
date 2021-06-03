import React from 'react';
import AppliancesTable from "./AppliancesTable";
import {Card, ListGroup} from "react-bootstrap";



export default function WasteAppliances() {
    return (
        <div>
            <AppliancesTable/>
            <Card style={{ width: '100%', margin: '5px 0', borderRadius: '5px' }}>
                <Card.Header>배출 방법</Card.Header>
                <ListGroup variant="flush">
                    <ListGroup.Item>1. 예약 배출</ListGroup.Item>
                    <ListGroup.Item>2. 수거 희망일 방문</ListGroup.Item>
                    <ListGroup.Item>3. 리사이클 센터 운반 및 처리</ListGroup.Item>
                </ListGroup>
            </Card>
            <Card style={{ width: '100%', margin: '5px 0', borderRadius: '5px' }}>
                <Card.Header>배출 신청</Card.Header>
                <ListGroup variant="flush">
                    <ListGroup.Item><a href='tel:1599-0953'>콜센터</a> ( 평일 08:00 ~ 18:00 )</ListGroup.Item>
                    <ListGroup.Item><a href={'www.15990903.or.kr'}>폐가전제품 배출예약시스템 홈페이지</a></ListGroup.Item>
                    <ListGroup.Item>카카오톡ID: 폐가전무상방문수거 추가 </ListGroup.Item>
                </ListGroup>
            </Card>
        </div>
    );
}
