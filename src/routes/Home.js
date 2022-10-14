
import React from "react";
import styled from "styled-components";
import Log from "../components/Log";
import moment from "moment/moment";

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
`;

const Home = () => {
    return (
        <GridContainer>
            <Log />

            <div>
                <ListHeader>
                    <p>활동 내역</p>
                </ListHeader>

                <Card>

                </Card>
            </div>
        </GridContainer>
    );
};


const Card = styled.div`    
    margin: 20px;

    border: none;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
    border-radius: 5px;
    
    padding: 15px;

    color: #000;
    font-size: 20px;
    line-height: 1.3;

    position: relative;

    background-color: #fff;
  
    height: 300px;
    overflow: auto;
  
    & > p {
        white-space: pre-wrap;
        position: relative;
    }
`;

const ListHeader = styled.div`
    border-bottom: 3px solid #fff;
    padding-bottom: 10px;
    margin: 20px;

    text-align: center;

    & p {
        font-size: 25px;
    }
`;

export default Home;
