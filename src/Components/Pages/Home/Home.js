import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import { Button, Link, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { v4 as uuidv4 } from "uuid";
import "firebase/database";
import { useHistory } from "react-router-dom";
import firebase from "firebase/app";
import firebaseConfig from "../../../Config";
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

  const classes = styles();

  useEffect(() => {
    console.log(props.location.state.token + "bruhhhhhhhh");
    if (props.location.state.token) {
      getUserData();
    }
  }, [props.location.state.token]);

  const createRoom = () => {
    var db = firebase.database().ref();
    const id = uuidv4().substring(0, 3);
    db.child("rooms")
      .child(id)
      .child("members")
      .child(data.name)
      .set({ pfp: data.picture, isHost: true });
    props.history.push({ pathname: "/room", state: { roomId: id } });
  };

  const getUserData = async () => {
    const res = await axios.get("http://localhost:5000/user-data", {
      headers: { Authorization: "bearer " + props.location.state.token },
    });
    console.log(res.data);
    setdata(res.data);
    const potty = await axios.get("http://localhost:5000/user-data");
    console.log(potty);
  };

  return (
    <div className="main-cont">
      <div className="home-card">
        <div className="user-info">
          <img src={data.picture} width="150px" height="150px" />
          <div> {data.name} </div>
        </div>
        <hr></hr>
        <div className="user-info1">
          <TextField
            InputProps={{ className: classes.roomText }}
            fullWidth
            placeholder="A1B2"
            label="Enter room code"
            variant="outlined"
            color="secondary"
          ></TextField>
          <Button
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
