import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../fbase";
import { useHistory } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import styled from "styled-components";

const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    background-color: #000;
    border-bottom: 6px solid #2aa5d8;
    
    padding: 15px;

    color: #fff;

    & a {
        color: #fff;
        text-decoration: none;
    }

    & div:first-child > span {
        font-size: 20px;
        font-weight: bold;

        margin-right: 60px;
    }

    & div:first-child > a {
        font-size: 20px;
        font-weight: bold;

        margin-right: 20px;
    }

    & div:last-child > span {
        margin-right: 20px;
    }

    & button {
        background-color: orange;
        border-radius: 5px;
        color: #fff;
        padding: 5px 10px;
    }
`;

const Navigation = ({ userObj }) => {
    const [name, setName] = useState("");

    const history = useHistory();

    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    }

    const onChange = (event) => {
        const { target: { value } } = event;
        setName(value);
    }

    const onSubmit = async (event) => {
        event.preventDefault();

        await updateProfile(authService.currentUser, {
            displayName: name,
        })
    }

    return(
        <Header>
            <div>
                <span>CHUR ADMIN@톤베리</span>
                <Link to="/">Home</Link>
                <Link to="/itemboard">제안</Link>
            </div>
            
            <div>
                <span>{ userObj.displayName } 님</span>
                <button onClick={onLogOutClick}>로그아웃</button>

                { userObj.displayName === null &&
                    <form onSubmit={onSubmit}>
                        <input type="text" onChange={onChange} value={name} placeholder="이름" />
                        <input type="submit" value="변경" />
                    </form>
                }
            </div>
        </Header>
    );
};

export default Navigation;