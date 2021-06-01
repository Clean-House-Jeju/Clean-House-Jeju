import React, {useState} from 'react';
import styled from "styled-components";
import './WeeklyInform.css';
import DayInfoContainer from "./DayInfoContainer";

const Container = styled.div`
    margin-top: 30px;
    width: 100%;
`
const Nav = styled.div`
  display: flex;
  position: relative;
  background-color: red;
`
const Tab = styled.div`
  width: 50%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  cursor: pointer;
  transition: color 0.15s ease-in;
  z-index: 1000;
`
const Glider = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 60px;
  width: 50%;
  background-color: #fff;
  transition: 0.25s ease-out;
  transform: translate3D(${props => props.index * 100}%, 0, 0);
`;

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
            {
                index === 0? <DayInfoContainer/>: <div>안녕</div>
            }
        </Container>
    );
}
