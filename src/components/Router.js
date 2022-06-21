import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import MinutesPage from "../routes/MinutesPage";
import ProposalPage from "../routes/ProposalPage";
import UserListPage from "../routes/UserListPage";
import Navigation from "./Navigation";

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
                                <Route exact path="/">
                                    <Home />
                                </Route>

                                <Route exact path="/proposal">
                                    <ProposalPage userObj={userObj} />
                                </Route>

                                <Route exact path="/useradmin">
                                    <UserListPage status={true} />
                                </Route>

                                <Route exact path="/withdrawaluseradmin">
                                    <UserListPage status={false} />
                                </Route>

                                <Route exact path="/minutes">
                                    <MinutesPage userObj={userObj} />
                                </Route>
                            </>
                        ) : (
                            <>
                                <p>인증되지 않은 사용자</p>
                            </>
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