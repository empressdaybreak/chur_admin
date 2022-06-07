import React from "react";
import { authService } from "../fbase";
import { useHistory } from "react-router-dom";

const Navigation = ({ userObj }) => {
    const history = useHistory();

    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    }
    return(
        <div>
            { userObj.uid === "hdBezcETkCVYOfjCB5CyocVCDsq2" && "토꾸" }
            <button onClick={onLogOutClick}>로그아웃</button>
        </div>
    );
};

export default Navigation;