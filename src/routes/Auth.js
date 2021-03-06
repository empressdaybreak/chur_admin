import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { authService } from "../fbase";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldCat } from "@fortawesome/free-solid-svg-icons";

const FlexBox = styled.div`
    border-radius: 5px;
    box-shadow: 0 2px 10px rgb(0 0 0 / 70%);

    & p {
        font-size: 18px;
        margin-bottom: 10px;
    }

    & > div {
        padding: 30px;
        width: 700px;
        box-sizing: border-box;
        
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        & div:first-child {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;

            padding: 10px;
        }

        & div:last-child {
            flex: 0.5;

            & svg {
                width: 100%;
                height: 100%;
                padding: 10px;
            }
        }

        & input {
            margin-bottom: 10px;
            background-color: #202225;
            border: none;
            padding: 10px;
            border-radius: 5px;

            color: #fff;

            &:focus {
                outline: none;
            }
        }
    }
`;

const LoginButton = styled.p`
    border: none;
    border-radius: 5px;

    padding: 10px 5px;
    margin-top: 20px;

    background-color: skyblue;
    color: #fff;

    cursor: pointer;

    text-align: center;
`;

const AuthContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const ErrorAlert = styled.p`
    white-space: pre-line;
    line-height: 1.2;

    margin: 0 !important;

    font-size: 17px !important;
`;

const SignInText = styled.p`
    margin: 10px 0 0 !important;
    text-align: center;
    cursor: pointer;
`;

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(false);
    const [error, setError] = useState("");

    const onChange = (event) => {
        const { target: { name, value } } = event;

        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();

        try {
            if (newAccount) {
                const data = await createUserWithEmailAndPassword(authService, email, password);
                // console.log(data);
            } else {
                const data = await signInWithEmailAndPassword(authService, email, password);
                // console.log(data);
            }
        } catch (error) {
            setError("????????? ???????????? ????????????! \n ?????? ??????????????? ????????????, ??????????????? ??????????????????!");
            // console.log(error);
        }
    }

    const toggleAccount = () => {
        setNewAccount(prev => !prev);
    }

    return (
        <AuthContainer>
            <FlexBox>
                <div>
                    <div>
                        <p>?????????</p>
                        <input
                            type="email"
                            name="email"
                            placeholder="?????????"
                            value={email}
                            onChange={onChange}
                            autoComplete="off"
                            required
                        />

                        <p>????????????</p>
                        <input
                            type="password"
                            name="password"
                            placeholder="????????????"
                            value={password}
                            onChange={onChange}
                            autoComplete="off"
                            required
                        />

                        <LoginButton onClick={onSubmit}>{newAccount ? "????????????" : "?????????"}</LoginButton>
                        {error && <ErrorAlert>{error}</ErrorAlert>}

                        <SignInText onClick={toggleAccount}>
                            {newAccount ? "??????????????? ??????" : "?????? ????????????"}
                        </SignInText>
                    </div>

                    <div>
                        <FontAwesomeIcon icon={faShieldCat} />
                    </div>
                </div>
            </FlexBox>
        </AuthContainer>
    );
};

export default Auth;
