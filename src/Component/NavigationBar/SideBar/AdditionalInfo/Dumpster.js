import React from 'react';
import {Card} from "react-bootstrap";
import './Dumpster.css';

const Dumpster = React.memo(() => {

    return (
        <div className='dumpster-container'>
            <Card className="dumpster-card" >
                <Card.Header className="text-center">대상 품목</Card.Header>
                <Card.Body>
                    <Card.Title style={{fontWeight: 'bold', marginBottom: '20px'}}>종량제 봉투에 담기 어려운 품목</Card.Title>
                    <Card.Text style={{fontSize: '15px'}}>
                        가구류, 가전제품, 이불, 큰인형, 피아노, 시계 등
                    </Card.Text>
                </Card.Body>
            </Card>

            <Card className='dumpster-card'>
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
});

export default Dumpster;
