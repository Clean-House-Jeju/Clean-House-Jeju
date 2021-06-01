import React from 'react';
import Logo from '../../../../lib/recycling-svgrepo-com.svg';
import styled from 'styled-components';

const Container = styled.div`
    position: relative;
    width: 100px;
    margin: 20px 8px;
    border: 1px solid #d3d3d3;
    border-radius: 5px;
  
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    
    &::after {
        background: ${props => props.color};
        border-radius: 16px 16px 0 16px;
        content: '${props => props.day}';
        height: 20px;
        width: 20px;
        left: -13px;
        top: -13px;
        overflow: hidden;
        position: absolute;
        
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 13px;
    }
`

const Header = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    
    width: 100%;
    padding: 5px 0; 
    font-size: 13px;
    font-weight: bold;
    background: #d3d3d3;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    
    border-bottom: 1px solid #d3d3d3;
`

const Body = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    
    width: 100%;
    font-size: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
`

const Icon = styled.img`
    width: 50px;
    height: 50px;
`

const DivLine = styled.div`
    height: 40px;
    border-left: 1px solid #d3d3d3;
`

const Text = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`

export default function DayInfoCard({color, day, type}) {
    return (
        <Container color={color} day={day[0]}>
            <Header>
                <Text>
                    {type}
                </Text>
            </Header>
            <Body>
                <Icon src={Logo} alt=""/>
            </Body>
        </Container>
    );
}
