import React from 'react';
import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    padding: 5px 20px;
    
    display: flex;
    justify-content: center;
    align-items: start;
    flex-direction: column;
`
const Title = styled.div`
    font-wight: bold;
    font-size: 20px;
    margin-bottom: 13px;
    
`

const Body = styled.div`
    font-size: 15px;
    
    @media screen and (max-width: 1800px) {
        line-height: 20px;
    }

`
const MoreInfoContents = React.memo(({title, body}) => {
    return (
        <Container>
            <Title>{title}</Title>
            <Body>{body}</Body>
        </Container>
    );
});

export default MoreInfoContents;

