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

    & span {
        cursor: default;
    }

    & a {
        color: #fff;
        text-decoration: none;
    }

    & div:first-child > span {
        font-size: 25px;
        margin-right: 60px;
    }

    & div:first-child > a {
        font-size: 20px;
        margin-right: 20px;
    }

    & div:last-child {
        display: flex;
        flex-direction: row;
        align-items: center;

        & > span {
            font-size: 20px;
            margin-right: 20px;
        }

        & > p {
            background-color: orange;
            border-radius: 5px;
            color: #fff;
            padding: 5px 10px;
            font-size: 18px;

            cursor: pointer;
        }
    }
`;

const Input = styled.input`
    border: 1px solid #dadada;
    border-radius: 5px;

    padding: 10px;
    margin-right: 10px;

    &:focus {
        outline: none;
    }
`;

const InputForm = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    
    margin-right: 20px;

    & > p {
        background-color: skyblue;
        border-radius: 5px;
        color: #fff;
        padding: 5px 10px;
        font-size: 18px;

        cursor: pointer;
    }
`;

const Navigation = ({ userObj, refreshUser }) => {
    const history = useHistory();
    const [name, setName] = useState("");

    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    }

    const onSubmit = async (event) => {
        event.preventDefault();
    
        if (name.includes(process.env.REACT_APP_USERAUTH_TAG)) {
            await updateProfile(authService.currentUser, {
                displayName: name,
            });
            
            refreshUser();    
        } else {
            alert("??????????????? ??????????????????.");
        }
    }

    const onChange = (event) => {
        const { target: { value } } = event;
        setName(value);
    }
    
    return(
        <Header>
            <div>
                <span>CHUR@?????????</span>
                {/* <Link to="/">Home</Link> */}
                <Link to="/">????????????</Link>
                <Link to="/withdrawaluseradmin">???????????????</Link>
                <Link to="/proposal">????????????</Link>
                <Link to="/minutes">?????????</Link>
                {userObj.displayName === "??????@breadcat" &&
                    <Link to="/test_page">??????????????????</Link>
                }
            </div>
            
            <div>
                {userObj.displayName === null ? (
                    <InputForm>
                        <Input type="text" onChange={onChange} value={name} placeholder="??????" />
                        <p onClick={onSubmit}>??????</p>
                    </InputForm>
                ) : (
                    <span>{userObj.displayName.replace(process.env.REACT_APP_USERAUTH_TAG, '')} ???</span>
                )}
            
                <p onClick={onLogOutClick}>????????????</p>
            </div>
        </Header>
    );
};

export default Navigation;