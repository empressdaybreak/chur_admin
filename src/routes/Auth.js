import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
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
                console.log(data);
            } else {
                const data = await signInWithEmailAndPassword(authService, email, password);
                console.log(data);
            }
        } catch (error) {
            setError(error.message);
            console.log(error);
        }
    }

    const toggleAccount = () => {
        setNewAccount(prev => !prev);
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
                
                <input type="submit" value={newAccount ? "Create Account" : "Sign In"} />
                {error && <span>{error}</span>}

                <span onClick={toggleAccount}>
                    {newAccount ? "Sign In" : "Create Account"}
                </span>
            </FlexBox>
        </div>
    );
};

export default Auth;