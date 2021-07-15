import React, { useState, useRef, useEffect } from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import BuildIcon from "@material-ui/icons/Build";
import "./Display_Card.css";
import MicOffIcon from "@material-ui/icons/MicOff";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";

import firebase from "firebase/app";
import "firebase/database";

function Display_Card({ data, isHost, isUserHost, roomId }) {
  const ref = useRef(null);
  const [drpdwn, setdrpdwn] = useState(false);
  var db = firebase.database().ref();

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setdrpdwn(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <div className="display-card" ref={ref}>
      {drpdwn ? (
        <div className="dropdown">
          <div className="dropdown-item">
            <MicOffIcon
              style={{ margin: "5px", marginLeft: "0px" }}
              color="error"
            />
            Server mute
          </div>
          <div
            className="dropdown-item"
            onClick={() => {
              db.child("rooms")
                .child(roomId)
                .child("members")
                .child(data.uid)
                .update({ isHost: true });
            }}
          >
            <BuildIcon
              style={{ margin: "5px", marginLeft: "0px" }}
              color="primary"
            />
            Make Host
          </div>
          <div className="dropdown-item">
            <RemoveCircleIcon
              style={{ margin: "5px", marginLeft: "0px" }}
              color="error"
            />
            Kick
          </div>
        </div>
      ) : (
        <div className="dropdown-close"></div>
      )}
      <button
        className="default-btn"
        onClick={() => {
          if (isUserHost) setdrpdwn(!drpdwn);
        }}
      >
        <MoreVertIcon
          classname="more-icon"
          color={isUserHost ? "error" : "disabled"}
        />
      </button>
      <div className="main-things-display">
        <img src={data.pfp} width="100vw" height="100vh" alt="Pfp" />
        <div className="card-name-display">
          {data.name}
          {isHost ? "👑" : null}
        </div>
      </div>
    </div>
  );
}

export default Display_Card;
