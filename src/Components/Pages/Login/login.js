import React, { useState, useEffect } from "react";
import "./Login.css";
import LoginBG from "./LoginBG";
import firebase from "firebase/app";
import "firebase/auth";
import { Button } from "@material-ui/core";
import { Redirect } from "react-router";
import TwitterIcon from "@material-ui/icons/Twitter";
import GitHubIcon from "@material-ui/icons/GitHub";
import GTranslateRoundedIcon from "@material-ui/icons/GTranslateRounded";
import FacebookIcon from "@material-ui/icons/Facebook";
import Logo from "../../../Images/Logo_Icon_only.png";
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

  const loginWithFacebook = () => {
    firebase
      .auth()
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
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
              <img src={Logo} alt="Bitchass" className="logo" />
              <div className="slogan">Sign in to BlipBlop</div>
              {/* other btn*/}
              <div className="btns-main">
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
                  className="facebook-sign-in"
                  color="primary"
                  variant="contained"
                  onClick={loginWithFacebook}
                >
                  <FacebookIcon className="x" />
                  Login with Facebook
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
              <div className="error">{error}</div>
            </div>
          </div>
          <LoginBG />
        </>
      )}
    </div>
  );
}

export default Login;
