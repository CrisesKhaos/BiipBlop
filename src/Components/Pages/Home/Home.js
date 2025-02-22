import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import { Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { v4 as uuidv4 } from "uuid";
import "firebase/database";
import firebase from "firebase/app";
const styles = makeStyles({
  roomText: {
    "& input:valid + fieldset": {
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

function Home(props) {
  const [data, setdata] = useState({});
  const [code, setcode] = useState("");
  const [error, seterror] = useState("");
  const classes = styles();

  useEffect(() => {
    if (props.location.state.token) {
      console.log(props.location.state.token);
      console.log("wentin");
      getUserData();
    }
  }, [props.location.state.token]);

  var db = firebase.database().ref();

  const createRoom = () => {
    const id = uuidv4().substring(0, 3);
    db.child("rooms").child(id).child("members").child(data.uid).set({
      name: data.name,
      pfp: data.picture,
      isHost: true,
      uid: data.uid,
    });

    db.child("rooms")
      .child(id)
      .update({ vinfo: { id: "dQw4w9WgXcQ", isPaused: false } });
    props.history.push({
      pathname: "/room",
      state: { roomId: id, uid: data.uid, name: data.name },
    });
  };

  const logoutHandler = async () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        localStorage.setItem("bb-auth", "false");
        console.log("hiiiiiiiii");
        console.log(localStorage.getItem("bb-auth"));
        props.history.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const joinRoom = () => {
    if (code) {
      console.log(`Joined Room ${code} bruh`);
      db.child("rooms")
        .child(code)
        .get()
        .then((snapshot) => {
          if (snapshot.exists()) {
            if (!snapshot.val().members[data.uid]) {
              db.child("rooms")
                .child(code)
                .child("members")
                .child(data.uid)
                .set({
                  name: data.name,
                  pfp: data.picture,
                  isHost: false,
                  uid: data.uid,
                });
              props.history.push({
                pathname: "/room",
                state: { roomId: code, uid: data.uid, name: data.name },
              });
            } else seterror("Bruh youre already in this meeting?🐒");
          } else {
            seterror("Room does not exist. 🤡🤡");
          }
        });
    } else {
      console.log("Did not join Room");
    }
  };

  const getUserData = async () => {
    const res = await axios.get("https://blip-blop.herokuapp.com/user-data", {
      headers: { Authorization: "bearer " + props.location.state.token },
    });
    setdata(res.data);
  };

  return (
    <div className="main-cont-home">
      <div
        className="home-card"
        onClick={() => {
          seterror("");
        }}
      >
        <div className="user-info">
          <img src={data.picture} width="150px" height="150px" />
          <div> {data.name} </div>
          <Button onClick={logoutHandler} variant="outlined" color="secondary">
            Log Out
          </Button>
        </div>
        <hr className="hr" />
        <div className="user-info1">
          <TextField
            value={code}
            onChange={(e) => {
              setcode(e.target.value);
            }}
            InputProps={{ className: classes.roomText }}
            fullWidth
            placeholder="A1B2"
            label="Enter room code"
            variant="outlined"
            color="secondary"
            error={error != ""}
            helperText={error}
          ></TextField>
          <Button
            onClick={joinRoom}
            variant="contained"
            color="secondary"
            size="medium"
            fullWidth
            style={{
              marginTop: "20px",
              marginBottom: "20px",
              fontSize: "20px",
            }}
          >
            Join room
          </Button>
          OR
          <Button
            onClick={createRoom}
            variant="contained"
            color="primary"
            size="medium"
            fullWidth
            style={{ fontSize: "18px", marginTop: "20px" }}
          >
            Create a room
          </Button>
        </div>
      </div>
    </div>
  );
}
export default Home;
