import { useEffect, useState } from "react";
import { authService } from "../fbase";
import AppRouter from "./Router";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);

        setUserObj({
          email: user.email,
          uid: user.uid,
        })
      } else {
        setIsLoggedIn(false);
      }

      setInit(true);

      console.log(user);
    });
  }, []);

  return (
    <>
      {init ? (
        <AppRouter
          isLoggedIn={isLoggedIn}
          userObj={ userObj }
        />
      ) : (
          "로딩중 ..."
      )}
    </>
  );
}

export default App;
