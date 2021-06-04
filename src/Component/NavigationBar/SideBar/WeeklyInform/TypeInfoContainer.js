import React from "react";
import {typeData} from "../../../../lib/showDataByDate";
import styled from "styled-components";
import TypeInfoCard from "./TypeInfoCard";

const Wrapper = styled.div`
    width: 100%;
    
    display: flex;
    justify-content: center;
    align-items: center;
`
const Container = styled.div`
    width: 50%;
    
    display: grid;
    grid-template-columns: repeat( 2, 1fr);
    grid-template-rows: repeat( 2,1fr); 
    grid-gap: 10px;
    margin: 20px 8px;
`

export default function TypeInfoContainer() {
    return (
        <Wrapper>
            <Container>
                {
                    typeData.map((data, i) => (
                        <TypeInfoCard key={i} type={data.type} day={data.day} img={data.img}/>
                    ))
                }
            </Container>
        </Wrapper>
    );
}
