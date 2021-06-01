import React from "react";
import {typeData} from "../../../../lib/showDataByDate";
import styled from "styled-components";
import TypeInfoCard from "./TypeInfoCard";

const Container = styled.div`
    width: 100%;
    
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

export default function TypeInfoContainer() {
    return (
        <Container>
            {
                typeData.map((data, i) => (
                    <TypeInfoCard key={i} type={data.type} day={data.day}/>
                ))
            }
        </Container>
    );
}
