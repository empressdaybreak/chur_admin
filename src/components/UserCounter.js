import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCat, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { faShieldCat } from "@fortawesome/free-solid-svg-icons";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faBreadSlice } from "@fortawesome/free-solid-svg-icons";
import { faBabyCarriage } from "@fortawesome/free-solid-svg-icons";

const UserCounterBox = styled.div`
    border: none;
    box-shadow: 0 2px 10px rgb(0 0 0 / 10%);
    border-radius: 5px;

    padding: 20px 0;
    
    background: #fff;

    font-size: 20px;
    color: #000;
    
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    text-align: center;

    & span {
        margin-right: 5px;
    }

    & div > p:first-child {
        margin-bottom: 10px;
    }
`;

const UserCounter = ({ userData }) => {
    return (
        <UserCounterBox>
            <div>
                <p>
                    <span>전체인원</span>
                    <FontAwesomeIcon icon={faUserGroup} />
                </p>
                <p>{userData.length} 명</p>
            </div>
            <div>
                <p>
                    <span>킹냥이</span>
                    <FontAwesomeIcon icon={faCrown} />
                </p>
                <p>{userData.filter(item => item.rank === '1.킹냥이').length} 명</p>
            </div>
            <div>
                <p>
                    <span>운영냥이</span>
                    <FontAwesomeIcon icon={faShieldCat} />
                </p>
                <p>{userData.filter(item => item.rank === '2.운영냥이').length} 명</p>
            </div>
            <div>
                <p>
                    <span>집냥이</span>
                    <FontAwesomeIcon icon={faHouse} />
                </p>
                <p>{userData.filter(item => item.rank === '3.집냥이').length} 명</p>
            </div>
            <div>
                <p>
                    <span>뚱냥이</span>
                    <FontAwesomeIcon icon={faCat} />
                </p>
                <p>{userData.filter(item => item.rank === '4.뚱냥이').length} 명</p>
            </div>
            <div>
                <p>
                    <span>아기냥이</span>
                    <FontAwesomeIcon icon={faBabyCarriage} />
                </p>
                <p>{userData.filter(item => item.rank === '5.아기냥이').length} 명</p>
            </div>
            <div>
                <p>
                    <span>식빵굽는중</span>
                    <FontAwesomeIcon icon={faBreadSlice} />
                </p>
                <p>{userData.filter(item => item.rank === '6.식빵굽는중').length} 명</p>
            </div>
        </UserCounterBox>
    );
};

export default UserCounter;