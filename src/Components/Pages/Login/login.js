import React, { useState, useEffect } from "react";
import "./Login.css";
import LoginBG from "./LoginBG";
import firebase from "firebase/app";
import "firebase/auth";
import { Button } from "@material-ui/core";
import { Redirect } from "react-router";
import GitHubIcon from "@material-ui/icons/GitHub";
import GTranslateRoundedIcon from "@material-ui/icons/GTranslateRounded";
function Login() {
  const [auth, setAuth] = useState(
    false || localStorage.getItem("bb-auth") === "true"
  );
  const [token, settoken] = useState("");
  const [email, setemail] = useState("");
  const [pass, setpass] = useState("");
  const [error, seterror] = useState("");

  useEffect((props) => {
    firebase.auth().onAuthStateChanged((userCreds) => {
      if (userCreds)
        userCreds.getIdToken().then((token) => {
          console.log("State changesd auth");
          settoken(token);
          console.log(token);
        });
      else console.log("Not signed in");
    });
  }, []);

  const loginWithGithub = () => {
    firebase
      .auth()
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then((userCreds) => {
        if (userCreds) {
          console.log("auth sign in");
          setAuth(true);
          localStorage.setItem("bb-auth", "true");
        }
      })
      .catch((error) => {
        console.log(error);
        seterror(error.message);
      });
  };

  const loginWithGoogle = () => {
    firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((userCreds) => {
        if (userCreds) {
          console.log("auth sign in");
          setAuth(true);
          localStorage.setItem("bb-auth", "true");
        }
      })
      .catch((error) => {
        console.log(error);
        seterror(error.message);
      });
  };

  const submitHandler = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then((userCreds) => {
        if (userCreds) {
          console.log("auth sign in");
          setAuth(true);
          localStorage.setItem("bb-auth", "true");
        }
      })
      .catch((error) => {
        seterror(error.message);

        console.log(error);
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
            <div
              className="login-card"
              onClick={() => {
                seterror("");
              }}
            >
              <img src="" width="100px" height="100px" />
              <div className="column">
                <input
                  type="text"
                  value={email}
                  placeholder="Email"
                  className="login-field"
                  onChange={(e) => {
                    setemail(e.target.value);
                  }}
                />
                <input
                  value={pass}
                  type="text"
                  placeholder="Password"
                  className="login-field"
                  onChange={(e) => {
                    setpass(e.target.value);
                  }}
                />
                <div className="error">{error}</div>
                <button
                  className="sign-in"
                  color="primary"
                  variant="contained"
                  onClick={submitHandler}
                >
                  Sign In
                </button>
              </div>
              <div className="btns">
                <button
                  className="google-sign-in"
                  color="primary"
                  variant="contained"
                  onClick={loginWithGoogle}
                >
                  <GTranslateRoundedIcon className="x" />
                  Login with Google
                </button>
                <button
                  className="github-sign-in"
                  color="primary"
                  variant="contained"
                  onClick={loginWithGithub}
                >
                  <GitHubIcon className="x" />
                  Login with Github
                </button>
              </div>
              <div className="signup">
                Dont have an account?
                <a href="/signup" className="link">
                  Sign up
                </a>
              </div>
            </div>
          </div>
          <LoginBG />
        </>
      )}
    </div>
  );
}

export default Login;
