import React, {useState} from 'react';
import styled from "styled-components";
import './WeeklyInform.css';
import DayInfoContainer from "./DayInfoContainer";
import TypeInfoContainer from "./TypeInfoContainer";

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
    height: 350px;
    display: flex;
    justify-content: start;
    align-items: center;
    border-bottom: 1px solid #d3d3d3;
`

const TextInfo = styled.ul`
    
    list-style-type: circle;
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


        </Container>
    );
}
