import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { authService } from "../fbase";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldCat } from "@fortawesome/free-solid-svg-icons";

const FlexBox = styled.div`
    border-radius: 5px;
    box-shadow: 0 2px 10px rgb(0 0 0 / 70%);

    & form {
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

            & p {
                margin: 10px 0 5px;
            }
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

        & button {
            border: none;
            border-radius: 5px;

            padding: 10px 5px;
            margin-top: 20px;

            background-color: skyblue;
            color: #fff;
            font-weight: bold;

            cursor: pointer;
        }
    }
`;

const AuthContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100vh;
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
            setError(error.message);
            // console.log(error);
        }
    }

    const toggleAccount = () => {
        setNewAccount(prev => !prev);
    }

    return (
        <AuthContainer>
            <FlexBox>
                <form onSubmit={onSubmit}>
                    <div>
                        <p>이메일</p>
                        <input
                            type="email"
                            name="email"
                            placeholder="이메일"
                            value={email}
                            onChange={onChange}
                            autoComplete="off"
                            required
                        />

                        <p>비밀번호</p>
                        <input
                            type="password"
                            name="password"
                            placeholder="패스워드"
                            value={password}
                            onChange={onChange}
                            autoComplete="off"
                            required
                        />
                        
                        <button>{newAccount ? "계정생성" : "로그인"}</button>
                        {error && <span>{error}</span>}

                        {/* <span onClick={toggleAccount}>
                            {newAccount ? "Sign In" : "Create Account"}
                        </span> */}
                    </div>

                    <div>
                        <FontAwesomeIcon icon={faShieldCat} />
                    </div>
                </form>
            </FlexBox>
        </AuthContainer>
    );
};

export default Auth;