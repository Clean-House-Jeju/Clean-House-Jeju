import React, {useState} from 'react';
import styled from "styled-components";
import './WeeklyInform.css';
import DayInfoContainer from "./DayInfoContainer";
import TypeInfoContainer from "./TypeInfoContainer";
import MoreInfoContents from "./MoreInfoContents";

const Container = styled.div`
    margin-top: 30px;
    width: 100%;
`
const Nav = styled.div`
  display: flex;
  position: relative;
  background-color: #eee;
`
const Tab = styled.div`
  width: 50%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: color 0.15s ease-in;
  z-index: 1000;
`
const Glider = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 30px;
  width: 50%;
  background-color: #fff;
  transition: 0.25s ease-out;
  transform: translate3D(${props => props.index * 100}%, 0, 0);
`;

const Content = styled.div`
    width: 100%;
  
    display: flex;
    justify-content: start;
    align-items: center;
    border-bottom: 1px solid #d3d3d3;
`

const MoreInfo = styled.div`
    width: 100%;
    background: #eee;
    border-bottom: 1px solid #d3d3d3;
    
    display: flex;
    justify-content: center;
    align-items: start;
    flex-direction: column;
    
    padding: 5px 20px; 
`

export default function WeeklyInform() {
    const [index, setIndex] = useState(0);
    const toggleState = (index) => {
        setIndex(index);
    }
    const menu = ['요일별', '항목별'];

    return (
        <Container>
            <Nav>
                {menu.map((text, i) => (
                    <Tab ket={i} onClick={() => toggleState(i)}>
                        {text}
                    </Tab>
                ))}
                <Glider index={index} />
            </Nav>
            <Content>
                {
                    index === 0? <DayInfoContainer/>: <TypeInfoContainer/>
                }
            </Content>

            <MoreInfo>
                <MoreInfoContents title='🚮 매일 배출' body='스티로폼, 병류, 캔, 고철류, 종량제 봉투, 음식물 쓰레기'/>
                <MoreInfoContents title='⏰ 이용 시간' body='오후 3시 ~ 새벽 5시'/>
            </MoreInfo>

        </Container>
    );
}
