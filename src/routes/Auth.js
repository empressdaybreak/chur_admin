import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { authService } from "../fbase";
import styled from "styled-components";

const FlexBox = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;

    max-width: 320px;
    margin: 60px auto;

    & > input {
        margin-bottom: 10px;
    }
`;

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");    

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

        const data = await signInWithEmailAndPassword(authService, email, password);
        console.log(data);
    }

    return (
        <div>
            <FlexBox onSubmit={onSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={onChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={onChange}
                    required
                />
                
                <input type="submit" value="로그인" />                
            </FlexBox>
        </div>
    );
};

export default Auth;