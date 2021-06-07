import React from "react";
import {Card, ListGroup} from "react-bootstrap";
import './OtherWaste.css';

export default function OtherWaste() {
    return (
        <div style={{width: '100%'}}>
            <Card style={{ width: '100%', margin: '5px 0', borderRadius: '5px' }}>
                <Card.Header>의류</Card.Header>
                <Card.Body>
                    <Card.Title style={{fontWeight: 'bold'}}>재활용이 불가능한 의류</Card.Title>
                    <Card.Text>
                        가까운 의류수거함에 배출
                    </Card.Text>
                </Card.Body>
                <Card.Body>
                    <Card.Title style={{fontWeight: 'bold'}}>재활용이 가능한 의류</Card.Title>
                    <Card.Text >
                        <ul className='cloth-list'>
                            <li>아름다운 가계</li>
                            <li>상설 새마을 알뜰 매장</li>
                            <li>제주시 나눔 장터 위원회</li>
                        </ul>
                        <div style={{fontSize: '15px'}}>위와 같은 장소에 기증할 수 있습니다.</div>
                    </Card.Text>
                </Card.Body>
            </Card>

            <Card style={{ width: '100%', margin: '5px 0', borderRadius: '5px' }}>
                <Card.Header>건전지</Card.Header>
                <Card.Body>
                    <Card.Title style={{fontWeight: 'bold', lineHeight: '25px'}}>주요지점에 비치된 폐전지 수거함에 배출</Card.Title>
                    <Card.Text style={{lineHeight: '25px'}}>
                        시청, 읍면사무소, 학교, 병원, 아파트 등
                    </Card.Text>
                </Card.Body>
            </Card>

            <Card style={{ width: '100%', margin: '5px 0', borderRadius: '5px' }}>
                <Card.Header>형광등</Card.Header>
                <ListGroup className='list-group' variant="flush">
                    <ListGroup.Item>1. 포장재를 벗겨, 깨지지 않게 지정된 폐형광등 분리수거함에 배출</ListGroup.Item>
                    <ListGroup.Item>2. 근처에 설치된 전용 회수함에 배출</ListGroup.Item>
                    <ListGroup.Item>3. 새로운 형광등을 구입할 때, 폐형광등을 판매점에 배출</ListGroup.Item>
                </ListGroup>
            </Card>

            <Card style={{ width: '100%', margin: '5px 0', borderRadius: '5px', lineHeight: '25px'}} body>더 자세히 보고싶다면 👉 <a href="https://www.jejusi.go.kr/recycle/intro/division/etcdiv.do">제주시재활용마당</a></Card>
        </div>
    );
}
