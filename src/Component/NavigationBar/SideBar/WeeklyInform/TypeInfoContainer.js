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
    width: 63%;
    
    display: grid;
    grid-template-columns: repeat( 2, minmax(100px, auto));
    grid-template-rows: repeat( 2, minmax(100px, auto)); 
    
    align-items: center;
    justify-items: center;
    grid-gap: 10px;
`

const TypeInfoContainer = React.memo(() => {
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
})

export default TypeInfoContainer
