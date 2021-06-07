import React from 'react';
import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    max-width: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 1px solid #d3d3d3;
    border-radius: 5px;
    margin: 15px 0;
    transition: transform .25s cubic-bezier(.7,.98,.86,.98), box-shadow .25s cubic-bezier(.7,.98,.86,.98);
    &:hover {
      transform: scale(1.1);  
      box-shadow: 0 9px 47px 11px rgba(51, 51, 51, 0.18);
    }
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
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 5px;
`
const Logo = styled.img`
    width: 70px;
    height: 70px;
    margin: 0 20px;
`

const Type = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
`


export default function TypeInfoCard({img, day, type}) {
    return (
        <Container>
            <Header>{day}</Header>
            <Content>
                <Logo src={img}/>
                <Type>
                    {type}
                </Type>
            </Content>
        </Container>
    );
}
