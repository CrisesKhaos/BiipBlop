import React, { useState, useEffect } from "react";
import "./Login.css";
import LoginBG from "./LoginBG";
import firebase from "firebase/app";
import "firebase/auth";
import { Button } from "@material-ui/core";
import Home from "../Home/Home";
import { Redirect } from "react-router";
function Login() {
  const [auth, setAuth] = useState(
    false || localStorage.getItem("bb-auth") === "true"
  );
  const [token, settoken] = useState("");

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userCreds) => {
      userCreds.getIdToken().then((token) => {
        settoken(token);
      });
    });
  }, []);

  const loginWithGoogle = () => {
    firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((userCreds) => {
        if (userCreds) {
          setAuth(true);
          console.log(userCreds.credential.idToken);
          localStorage.setItem("bb-auth", "true");
        }
      });
  };

  return (
    <div>
      {auth && token ? (
        <Redirect
          to={{
            pathname: "/home",
            state: { token: token },
          }}
        />
      ) : (
        <>
          <div className="main-cont">
            <div className="login-card">
              <Button
                color="primary"
                variant="contained"
                onClick={loginWithGoogle}
              >
                Login with Google
              </Button>
            </div>
          </div>
          <LoginBG />
        </>
      )}
    </div>
  );
}

export default Login;
