import React from 'react';
import styled from "styled-components";
import logo from '../../../../lib/recycling-svgrepo-com.svg';

const Container = styled.div`
    width: 70%;
    
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 1px solid #d3d3d3;
    border-radius: 5px;
    margin-top: 10px;
`
const Header = styled.div`
    width: 100%;
    padding: 5px 0;
    font-size: 15px;
    color: white;
    
    background: #5fc69a;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #d3d3d3;
    border-left-top-radius: 5px;
    border-right-top-radius: 5px;
`
const Content = styled.div`
    width: 100%;
    
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 5px;
`
const Logo = styled.img`
    width: 25px;
    height: 25px;
    margin: 0 20px;
`

const DivLine = styled.div`
    height: 30px;
    border-left: 1px solid #d3d3d3;

`

const Type = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
`


export default function TypeInfoCard({day, type}) {
    return (
        <Container>
            <Header>{day}</Header>
            <Content>
                <Logo src={logo}/>
                <DivLine/>
                <Type>
                    {type}
                </Type>
            </Content>
        </Container>
    );
}
