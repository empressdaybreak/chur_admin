
import React from "react";
import styled from "styled-components";
import Log from "../components/Log";

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
`;

const Home = () => {
    return (
        <GridContainer>
            <Log />
        </GridContainer>        
    );
};

export default Home;