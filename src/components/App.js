import { faShieldCat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { authService } from "../fbase";
import AppRouter from "./Router";

const SplashScreen = styled.div` 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: 100vh;

  & svg {
    width: 20%;
    height: 20%;
  }

  & p {
    margin-top: 20px;
    font-size: 20px;
  }
`;

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  const refreshUser = () => {
    const user = authService.currentUser;

    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  }

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);

        setUserObj({
          email: user.email,
          uid: user.uid,
          displayName: user.displayName,
        })
      } else {
        setIsLoggedIn(false);
      }

      setTimeout(() => {
        setInit(true);  
      }, 2000);

      // console.log(user);
    });
  }, []);

  return (
    <>
      {init ? (
        <AppRouter
          isLoggedIn={isLoggedIn}
          userObj={userObj}
          refreshUser={refreshUser}
        />
      ) : (
          <SplashScreen>
            <FontAwesomeIcon icon={ faShieldCat } />
            <p>로딩중</p>
          </SplashScreen>
      )}
    </>
  );
}

export default App;
