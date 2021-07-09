import firebase from "firebase/app";
import "firebase/database";
import "./Room.css";
import React, { useState, useEffect } from "react";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import CallEndIcon from "@material-ui/icons/CallEnd";
import YouTube from "react-youtube";
import Room_Popup from "../../Room_Popup";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import ReactPlayer from "react-player/youtube";
import axios from "axios";

import Chat from "../../Chat/Chat";

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
  const [mute, setmute] = useState(false);
  const [vid, setvid] = useState("dQw4w9WgXcQ");
  const [playing, setplaying] = useState(true);

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

  useEffect(async () => {
    db.child("rooms")
      .child(props.location.state.roomId)
      .child("vinfo")
      .on("value", (snapshot) => {
        setplaying(!snapshot.val().isPaused);
        if (snapshot.val().id !== vid) {
          setvid(snapshot.val().id);
        }
      });
  }, []);

  const getData = async () => {
    const res = await axios.get("http://localhost:5000/get-results", {
      headers: { id: search },
    });
    setsearchdata(res.data);
    console.log(searchdata);
  };

  const opts = {
    autoplay: 1,
    disablekb: 1,
    controls: 0,
    loop: 1,
  };

  const updatevid = (id) => {
    db.child("rooms")
      .child(props.location.state.roomId)
      .child("vinfo")
      .update({ id: id, isPaused: false });
  };
  const pausePlayback = (e) => {
    console.log("Tried stopped");
    if (isHost) {
      db.child("rooms")
        .child(props.location.state.roomId)
        .child("vinfo")
        .update({ isPaused: true });
    } else {
    }
  };

  const startPlayback = (e) => {
    console.log("Tried playing");
    if (isHost) {
      console.log("hi");
      db.child("rooms")
        .child(props.location.state.roomId)
        .child("vinfo")
        .update({ isPaused: false });
    } else {
    }
  };

  //  {
  //    members &&
  //      Object.values(members).map((data) => {
  //        return (
  //          <div key={Math.random() * 1000} className="display-card">
  //            <img src={data.pfp} width="100vw" height="100vh" />
  //            {data.name}
  //          </div>
  //        );
  //      });
  //  }

  // <YouTube
  //   onStateChange={(e) => console.log(e.target.getCurrentTime())}
  //   videoId={vid}
  //   className="video"
  //   opts={opts}
  //   onPause={pausePlayback}
  //   onPlay={startPlayback}
  //   onReady={(e) => {
  //     setplayer(e.target);
  //     console.log("Set player");
  //     setready(true);
  //   }}
  // />;
  return (
    <div className="main-cont">
      <Room_Popup
        open={modal}
        setopen={setmodal}
        data={searchdata}
        setid={updatevid}
      />
      <div className="one-row">
        <div className="video-wrapper">
          {isHost ? null : (
            <div
              className="embed-overlay"
              onClick={() => {
                console.log("clicked");
              }}
            />
          )}
          <ReactPlayer
            volume="1"
            muted={mute}
            onPause={pausePlayback}
            onPlay={startPlayback}
            playing={playing}
            width="100%"
            height="100%"
            url={`https://www.youtube.com/watch?v=${vid}`}
            config={{
              youtube: {
                playerVars: opts,
              },
            }}
          />
        </div>
        <div className="chat">
          <Chat
            uid={props.location.state.uid}
            roomId={props.location.state.roomId}
          />
        </div>
      </div>
      <div className="bottom-bar">
        {isHost ? (
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
        ) : null}
        <div className="btns"> Room Id : {props.location.state.roomId}</div>
        <div className="btns">
          {mute ? (
            <button
              type="button"
              className="end-call-btn"
              onClick={() => {
                setmute(false);
                console.log(mute);
              }}
            >
              <VolumeOffIcon fontSize="large" />
            </button>
          ) : (
            <button
              type="button"
              className="normal-btn"
              onClick={() => {
                setmute(true);
                console.log(mute);
              }}
            >
              <VolumeUpIcon fontSize="large" />
            </button>
          )}

          <button type="button" className="end-call-btn" onClick={leaveRoom}>
            <CallEndIcon fontSize="large" />
          </button>
        </div>
      </div>
    </div>
  );
}
