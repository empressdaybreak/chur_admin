import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import MinutesPage from "../routes/MinutesPage";
import ProposalPage from "../routes/ProposalPage";
import UserListPage from "../routes/UserListPage";
import Navigation from "./Navigation";
import styled from "styled-components";

const AuthScreen = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100vh;

    & p {
        font-size: 20px;
    }
`;

const AppRouter = ({ isLoggedIn, userObj, refreshUser }) => {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const authChecked = () => {
            if (userObj !== null) {
                if (userObj.displayName !== null) {
                    const a = userObj.displayName;
    
                    if (a.includes(process.env.REACT_APP_USERAUTH_TAG)) {
                        setIsAuth(true);
                    } else {
                        setIsAuth(false);
                    }
                } else if (userObj.displayName === null) {
                    setIsAuth(false);
                } 
            }
        };

        authChecked();
    }, [userObj]);

    return (
        <Router>
            {isLoggedIn &&
                <Navigation
                    userObj={userObj}
                    refreshUser={refreshUser}
                />
            }

            <Switch>
                {isLoggedIn ? (
                    <>
                        {isAuth ? (
                            <>
                                {/* <Route exact path="/">
                                    <Home />
                                </Route> */}

                                <Route exact path="/">
                                    <UserListPage status={true} userObj={userObj} />
                                </Route>
                                
                                <Route exact path="/proposal">
                                    <ProposalPage userObj={userObj} />
                                </Route>

                                <Route exact path="/withdrawaluseradmin">
                                    <UserListPage status={false} />
                                </Route>

                                <Route exact path="/minutes">
                                    <MinutesPage userObj={userObj} />
                                </Route>

                                <Route exact path="/test_page">
                                    <Home />
                                </Route>
                            </>
                        ) : (
                            <AuthScreen>
                                <p>인증되지 않은 사용자 입니다.</p>
                            </AuthScreen>
                        )}
                    </>
                ) : (
                    <Route path="/">
                        <Auth />
                    </Route>
                )};
            </Switch>
        </Router>
    )
}

export default AppRouter;