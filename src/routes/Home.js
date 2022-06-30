
import React from "react";
import styled from "styled-components";
import Log from "../components/Log";

const LogContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
`;

const Home = () => {
    return (
        <LogContainer>
            <Log />
        </LogContainer>
    );
};

export default Home;