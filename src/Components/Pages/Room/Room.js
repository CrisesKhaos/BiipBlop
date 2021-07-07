import firebase from "firebase/app";
import "firebase/database";
import "./Room.css";
import React, { useState, useEffect } from "react";
//import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import CallEndIcon from "@material-ui/icons/CallEnd";
import YouTube from "react-youtube";
import Room_Popup from "../../Room_Popup";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import axios from "axios";

const styles = makeStyles({
  roomText: {
    "& input:valid + fieldset": {
      label: "white",
      color: "white",
      borderColor: "white",
      borderWidth: 2,
    },
    "& input:invalid + fieldset": {
      borderColor: "pink",
      borderWidth: 2,
    },
    "& input:valid:focus + fieldset": {
      borderLeftWidth: 6,
      padding: "4px !important",
    },
    color: "white",
    borderColor: "white",
    fontSize: "20px",
  },
});

export default function Room(props) {
  const [members, setmembers] = useState({});
  const [modal, setmodal] = useState(false);
  const [search, setsearch] = useState("");
  const [searchdata, setsearchdata] = useState({});
  const [isHost, setisHost] = useState(false);
  const [vid, setvid] = useState("dQw4w9WgXcQ");

  const classes = styles();
  const db = firebase.database().ref();

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
  };

  useEffect(async () => {
    db.child("rooms")
      .child(props.location.state.roomId)
      .child("members")
      .on("value", (snapshot) => {
        if (snapshot.exists()) {
          setmembers(snapshot.val());
          if (props.location.state.uid) {
            setisHost(snapshot.val()[props.location.state.uid].isHost);
          }
        } else {
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

  const getData = async () => {
    const res = await axios.get("http://localhost:5000/get-results", {
      headers: { id: search },
    });
    setsearchdata(res.data);
    console.log(searchdata);
  };

  const opts = {
    playerVars: {
      disablekb: 1,
      controls: 0,
      autoplay: 1,
      loop: 1,
    },
  };

  return (
    <div className="main-cont">
      <Room_Popup
        open={modal}
        setopen={setmodal}
        data={searchdata}
        setid={setvid}
      />
      <div className="one-row">
        <YouTube
          videoId={vid}
          className="video"
          opts={opts}
          onPause={(e) => {
            !isHost ? e.target.playVideo() : console.log("Damn You the boss");
          }}
        />
        <div className="chat">
          {members &&
            Object.values(members).map((data) => {
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
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await getData();
            setsearch("");
            setmodal(true);
          }}
        >
          <TextField
            style={{ marginLeft: "4vw", color: "white" }}
            onChange={(e) => {
              setsearch(e.target.value);
            }}
            InputProps={{ className: classes.roomText }}
            color="secondary"
            size="large"
            label="Search for a video"
            fullWidth
            variant="outlined"
            value={search}
            type="text"
          />
        </form>
        Room Id : {props.location.state.roomId}
        <div className="btns">
          <button
            type="button"
            className="end-call-btn"
            onClick={() => setvid("pXRviuL6vMY")}
          >
            <MicOffIcon fontSize="large" />
          </button>
          <button type="button" className="end-call-btn" onClick={leaveRoom}>
            <CallEndIcon fontSize="large" />
          </button>
        </div>
      </div>
    </div>
  );
}
