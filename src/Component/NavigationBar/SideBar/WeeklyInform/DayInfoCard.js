import React from 'react';
import Logo from '../../../../lib/recycling-svgrepo-com.svg';
import styled from 'styled-components';

const Container = styled.div`
    position: relative;
    width: 80%;
    margin: 20px auto;
    border: 1px solid #d3d3d3;
    border-radius: 5px;
    padding: 5px 0;
    display: flex;
    justify-content: start;
    align-items: center;
    
    &::after {
        background: ${props => props.color};
        border-radius: 16px 16px 0 16px;
        content: '${props => props.day}';
        height: 48px;
        width: 48px;
        left: -10px;
        top: -10px;
        overflow: hidden;
        position: absolute;
        
        display: flex;
        justify-content: center;
        align-items: center;

    }
`
// ${props => props.text || '월'}
// ${props => props.color || `black`}
const Icon = styled.img`
    width: 40px;
    height: 40px;
    margin-left: 55px;
    margin-right: 30px;
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
            <Icon src={Logo} alt=""/>
            <DivLine/>
            <Text>
                {type}
            </Text>
        </Container>
    );
}
