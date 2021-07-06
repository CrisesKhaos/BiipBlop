import firebase from "firebase/app";
import "firebase/database";
import "./Room.css";
import React, { useState, useEffect } from "react";

export default function Room(props) {
  const [members, setmembers] = useState({});
  const db = firebase.database().ref();
  useEffect(() => {
    db.child("rooms")
      .child(props.location.state.roomId)
      .child("members")
      .get()
      .then((snapshot) => {
        setmembers(snapshot.val());
      });
  }, []);

  console.log(props.location.state.roomId);
  return (
    <div className="main-cont">
      <div className="one-row">
        <div className="video"></div>
        <div className="chat">{Object.keys(members)}</div>
      </div>
      <div className="bottom-bar"></div>
    </div>
  );
}
