import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "../routes/Auth";
import ProposalPage from "../routes/ProposalPage";
import UserListPage from "../routes/UserListPage";
import Navigation from "./Navigation";

const AppRouter = ({ isLoggedIn, userObj, refreshUser }) => {
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
                        <Route exact path="/">
                            
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
                            
                        </Route>
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