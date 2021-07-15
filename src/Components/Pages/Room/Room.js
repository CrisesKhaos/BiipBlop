import firebase from "firebase/app";
import "firebase/database";
import "./Room.css";
import React, { useState, useEffect, useRef } from "react";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import CallEndIcon from "@material-ui/icons/CallEnd";
import Room_Popup from "../../Room_Popup";
import ChatIcon from "@material-ui/icons/Chat";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import ReactPlayer from "react-player/youtube";
import axios from "axios";
import Chat from "../../Chat/Chat";
import Display_Card from "../../Display_Card/Display_Card";
import io from "socket.io-client";

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

const socket = io("https://blip-blop.herokuapp.com/");

export default function Room(props) {
  const [members, setmembers] = useState({});
  const [modal, setmodal] = useState(false);
  const [search, setsearch] = useState("");
  const [searchdata, setsearchdata] = useState({});
  const [isHost, setisHost] = useState(false);
  const [mute, setmute] = useState(true);
  const [vid, setvid] = useState("dQw4w9WgXcQ");
  const [playing, setplaying] = useState(true);
  const [chat, setchat] = useState(false);
  const [dropdown, setdropdown] = useState([]);
  const [error, seterror] = useState("");
  const [stream, setstream] = useState(null);

  const classes = styles();
  const player = useRef(null);
  const db = firebase.database().ref();

  const getPerms = async () => {
    await navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((strm) => {
        setstream(strm);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const leaveRoom = async () => {
    props.history.push({
      pathname: "/",
    });
    await db
      .child("rooms")
      .child(props.location.state.roomId)
      .child("members")
      .child(props.location.state.uid)
      .remove();
    socket.emit("dc");
    window.location.reload();
    socket.destroy();
  };

  useEffect(async () => {
    db.child("rooms")
      .child(props.location.state.roomId)
      .child("members")
      .on("value", (snapshot) => {
        if (snapshot.exists()) {
          setmembers(snapshot.val());
          setdropdown([...dropdown, false]);
          if (props.location.state.uid && snapshot.exists()) {
            setisHost(snapshot.val()[props.location.state.uid].isHost);
          }
        } else {
          props.history.push({
            pathname: "/",
          });
        }
      });
    getPerms().then(() => {
      console.log(stream);
    });
    window.addEventListener("unload", leaveRoom);
    return () => {
      window.removeEventListener("unload", leaveRoom);
      leaveRoom();
    };
  }, []);

  {
    /*video info */
  }
  useEffect(async () => {
    db.child("rooms")
      .child(props.location.state.roomId)
      .child("vinfo")
      .on("value", (snapshot) => {
        if (snapshot.val().isPaused) console.log("is puased");
        setplaying(!snapshot.val().isPaused);
        if (snapshot.val().id !== vid) {
          setvid(snapshot.val().id);
        }
      });
  }, []);

  {
    /* //!Mfs be using the socket stuff here to keep it clean up*/
  }
  useEffect(() => {
    socket.emit("join-room", props.location.state.roomId);

    socket.on("recieve-time", (x) => {
      var diff = player.current.getCurrentTime() - x;
      if (diff < -3 || diff > 3) {
        player.current.seekTo(x);
        console.log(x);
        return;
      }
    });
  }, []);

  const getData = async () => {
    const res = await axios.get("https://blip-blop.herokuapp.com/get-results", {
      headers: { id: search },
    });
    setsearchdata(res.data);
  };

  const opts = {
    autoplay: 1,
    disablekb: 1,
    controls: 0,
    loop: 0,
  };

  const updatevid = (id) => {
    db.child("rooms")
      .child(props.location.state.roomId)
      .child("vinfo")
      .update({ id: id, isPaused: false });
  };

  const pausePlayback = (e) => {
    setplaying(false);
    console.log("poti");
    if (isHost) {
      db.child("rooms")
        .child(props.location.state.roomId)
        .child("vinfo")
        .update({ isPaused: true });
    } else {
    }
  };

  const updateTimings = (time) => {
    socket.emit("send-time", time.playedSeconds, props.location.state.roomId);
  };

  const startPlayback = (e) => {
    if (isHost) {
      db.child("rooms")
        .child(props.location.state.roomId)
        .child("vinfo")
        .update({ isPaused: false });
    } else {
    }
  };

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
    <div className="main-cont" onClick={(e) => {}}>
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
                seterror("Only hosts can control the video playback 💀💀");
              }}
            />
          )}
          <ReactPlayer
            loop={true}
            ref={player}
            onProgress={(x) => {
              if (isHost) updateTimings(x);
              if (!playing) player.current.getInternalPlayer().pauseVideo();
            }}
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
          {chat ? (
            <Chat
              uid={props.location.state.uid}
              roomId={props.location.state.roomId}
              name={props.location.state.name}
            />
          ) : (
            members &&
            Object.values(members).map((data, index) => {
              return (
                <div key={Math.random() * 1000}>
                  <Display_Card
                    data={data}
                    isHost={data.isHost}
                    isUserHost={isHost}
                    roomId={props.location.state.roomId}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
      <div
        className="bottom-bar"
        onClick={() => {
          seterror("");
        }}
      >
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
        <div className="clmn">
          <div className="btns"> Room Id : {props.location.state.roomId}</div>
          <div className="error">{error}</div>
        </div>
        <div className="btns">
          <button
            type="button"
            className={chat ? "msg-btn-on" : "normal-btn"}
            onClick={() => {
              setchat(!chat);
            }}
          >
            <ChatIcon fontSize="large" />
          </button>
          {mute ? (
            <button
              type="button"
              className="end-call-btn"
              onClick={() => {
                setmute(!mute);
              }}
            >
              <VolumeOffIcon fontSize="large" />
            </button>
          ) : (
            <button
              type="button"
              className="normal-btn"
              onClick={() => {
                setmute(!mute);
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
