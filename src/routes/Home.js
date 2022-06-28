
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
            <Log type={"UserLog"} />
            <Log type={""} />
            <Log type={""} />
            <Log type={""} />
        </LogContainer>
    );
};

export default Home;