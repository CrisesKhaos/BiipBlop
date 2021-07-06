import firebase from "firebase/app";
import "firebase/database";
import "./Room.css";
import React, { useState, useEffect } from "react";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import CallEndIcon from "@material-ui/icons/CallEnd";
export default function Room(props) {
  const [members, setmembers] = useState({});
  const db = firebase.database().ref();

  useEffect(async () => {
    db.child("rooms")
      .child(props.location.state.roomId)
      .child("members")
      .on("value", (snapshot) => {
        if (snapshot.exists()) {
          console.log("yup");
          setmembers(snapshot.val());
        } else {
          console.log("nope");
          props.history.push({
            pathname: "/",
          });
        }
      });

    window.addEventListener("unload", leaveRoom);
    return () => {
      window.removeEventListener("unload", leaveRoom);
      leaveRoom();
    };
  }, []);

  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  const leaveRoom = async () => {
    await db
      .child("rooms")
      .child(props.location.state.roomId)
      .child("members")
      .child(props.location.state.uid)
      .remove();
    props.history.push({
      pathname: "/",
    });
    console.log("hi");
  };

  return (
    <div className="main-cont">
      <div className="one-row">
        <div className="video"></div>
        <div className="chat">
          {members &&
            Object.values(members).map((data) => {
              console.log(data);
              return (
                <div key={Math.random() * 1000} className="display-card">
                  <img src={data.pfp} width="100vw" height="100vh" />
                  {data.name}
                </div>
              );
            })}
        </div>
      </div>
      <div className="bottom-bar">
        <button type="button" className="end-call-btn">
          <MicOffIcon fontSize="large" />
        </button>
        <button type="button" className="end-call-btn" onClick={leaveRoom}>
          <CallEndIcon fontSize="large" />
        </button>
      </div>
    </div>
  );
}
