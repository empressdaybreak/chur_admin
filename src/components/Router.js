import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "../routes/Auth";
import DashBoard from "../routes/DashBoard";
import UserListPage from "../routes/UserListPage";
import Navigation from "./Navigation";

const AppRouter = ({ isLoggedIn, userObj }) => {
    return (
        <Router>
            {isLoggedIn && <Navigation userObj={ userObj } /> }

            <Switch>
                {isLoggedIn ? (
                    <>
                        <Route exact path="/">
                            <DashBoard userObj={userObj} />
                        </Route>

                        <Route exact path="/itemboard">
                            <UserListPage />
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