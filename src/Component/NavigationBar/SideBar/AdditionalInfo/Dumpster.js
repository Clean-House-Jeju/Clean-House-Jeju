import React from 'react';
import {Card} from "react-bootstrap";

export default function Dumpster() {
    const style = {
        width: '95%',
        margin: '5px 0',
        borderRadius: '5px'
    }
    return (
        <div>
            <Card className="text-center" style={style}>
                <Card.Header>대상 품목</Card.Header>
                <Card.Body>
                    <Card.Title style={{fontWeight: 'bold', marginBottom: '20px'}}>종량제 봉투에 담기 어려운 품목</Card.Title>
                    <Card.Text style={{fontSize: '15px'}}>
                        가구류, 가전제품, 이불, 큰인형, 피아노, 시계 등
                    </Card.Text>
                </Card.Body>
            </Card>

            <Card style={style}>
                <Card.Header className="text-center">배출 방법</Card.Header>
                <Card.Body>
                    <Card.Text style={{fontSize: '17px', fontWeight: 'bold'}}>
                        <div style={{marginBottom: '8px'}}>1. 제주시 또는 서귀포시 홈페이지 접속</div>
                        <div>2. 대형 폐기물 배풀 신고 클릭!</div>
                    </Card.Text>
                </Card.Body>
                <Card.Footer className="text-center">
                    <Card.Link href="https://www.jejusi.go.kr/waste/main.do">제주시</Card.Link>
                    <Card.Link href="https://www.seogwipo.go.kr/field/living/new_waste/order.htm">서귀포시</Card.Link>
                </Card.Footer>
            </Card>
        </div>
    )
}
