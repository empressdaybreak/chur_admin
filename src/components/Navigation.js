import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../fbase";
import { useHistory } from "react-router-dom";
import { updateProfile } from "firebase/auth";

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
        <div>
            <Link to="/">Home</Link>
            <Link to="/itemboard">제안</Link>

            Chur Admin
            { userObj.displayName }
            <button onClick={onLogOutClick}>로그아웃</button>

            { userObj.displayName === null &&
                <form onSubmit={onSubmit}>
                    <input type="text" onChange={onChange} value={name} placeholder="이름" />
                    <input type="submit" value="변경" />
                </form>
            }
        </div>
    );
};

export default Navigation;