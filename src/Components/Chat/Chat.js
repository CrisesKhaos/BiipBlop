import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
import "firebase/database";
import InputAdornment from "@material-ui/core/InputAdornment";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import { TextField, Button, IconButton } from "@material-ui/core";
import "./Chat.css";

function Chat({ roomId, uid, name }) {
  const [currentmsg, setcurrentmsg] = useState("");
  const [messages, setmessages] = useState({
    asfd: { name: "BlipBlop", msg: "BlipBlop! BlopBlip?" },
  });

  const btm = useRef(null);
  const db = firebase.database().ref();

  useEffect(() => {
    console.log(uid);
    db.child("messages")
      .child(roomId)
      .on("value", (snapshot) => {
        if (snapshot.exists()) {
          console.log("setmessages");
          setmessages(snapshot.val());
          btm.current?.scrollIntoView({ behavior: "smooth" });
        }
      });
  }, []);

  const submithandler = (e) => {
    e.preventDefault();
    if (currentmsg)
      db.child("messages")
        .child(roomId)
        .push()
        .set({ name: name, msg: currentmsg });
    setcurrentmsg("");
  };

  return (
    <div className="chat-cont-main">
      <div className="chat-cont">
        {Object.values(messages).map((element, index) => {
          return (
            <div className="chat-ind">
              <div className="chat-name">{element.name}</div>
              <div className="chat-msg">{element.msg}</div>
            </div>
          );
        })}
        <div ref={btm} className="btm" />
      </div>
      <div className="textfield">
        <form onSubmit={submithandler} fullwidth>
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    children={
                      <SendRoundedIcon color="white" variant="primary" />
                    }
                    onClick={(e) => {
                      submithandler(e);
                    }}
                  ></IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              setcurrentmsg(e.target.value);
            }}
            value={currentmsg}
            placeholder="Im naturally aspirated 😎"
            label="Type a message!!"
            fullWidth
            variant="outlined"
            color="secondary"
          />
        </form>
      </div>
    </div>
  );
}

export default Chat;
