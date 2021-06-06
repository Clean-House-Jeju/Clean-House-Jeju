import React from 'react';
import styled from 'styled-components';
import {dayName} from "../../../../lib/showDataByDate";

const Container = styled.div`
    position: relative;
    max-width: 200px;
    width: 80%;
    margin: 20px 8px;
    border: 1px solid #d3d3d3;
    border-radius: 5px;
  
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transition: transform .25s cubic-bezier(.7,.98,.86,.98), box-shadow .25s cubic-bezier(.7,.98,.86,.98);
    ${ props => props.day === dayName
    ? `transform: scale(1.2);
      box-shadow: 0 9px 47px 11px rgba(51, 51, 51, 0.18);`
    : ''
    }
    &:hover {
      transform: scale(1.1);  
      box-shadow: 0 9px 47px 11px rgba(51, 51, 51, 0.18);
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
     ${ props => props.day === dayName
    ? `background: #5fc69a;`
    : `background: #d3d3d3;`
}
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    
    border-bottom: 1px solid #d3d3d3;
`

const Body = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-weight: bold;
    
    width: 100%;
    font-size: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
`

const Icon = styled.img`
    width: 70px;
    height: 70px;
`

const Text = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`

export default function DayInfoCard({name, img, day, type}) {
    return (
        <Container className={name} day={day} >
            <Header day={day} >
                <Text>
                    {day}
                </Text>
            </Header>
            <Body>
                <Icon src={img} alt=""/>
                {type}
            </Body>
        </Container>
    );
}
