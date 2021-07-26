//! PERR JS FOR VC

// {
//   Object.values(socketids).forEach((tid, index) => {
//     let stream;
//     const peer = new Peer({
//       initiator: true,
//       trickle: false,
//       config: {
//         iceServers: [
//           {
//             urls: "stun:numb.viagenie.ca",
//             username: "sultan1640@gmail.com",
//             credential: "98376683",
//           },
//           {
//             urls: "turn:numb.viagenie.ca",
//             username: "sultan1640@gmail.com",
//             credential: "98376683",
//           },
//         ],
//       },
//     });

//     peer.on("signal", (data) => {
//       if (data.renegotiate || data.transceiverRequest) return;
//       console.log(data);
//       console.log("Made peer");
//       socket.emit("callUser", {
//         roomId: props.location.state.roomId,
//         signalData: data,
//         callerId: userid,
//         toCall: tid,
//       });
//     });

//     peer.on("stream", (strm) => {
//       stream = strm;
//       console.log("Got stream");
//     });

//     socket.on("callAccepted", (signal) => {
//       console.log("Recived Signal");
//       console.log(signal);
//       peer.signal(signal);
//       return <AudioStream audioStream={stream} ownerId={tid} />;
//     });
//     return <AudioStream audioStream={stream} ownerId={tid} />;
//   });
// }

// socket.on("callIncoming", (data) => {
//   console.log(`${data.callerId} called`);
//   const peer = new Peer({
//     initiator: false,
//     trickle: false,
//     stream: stream,
//     config: {
//       iceServers: [
//         {
//           urls: "stun:numb.viagenie.ca",
//           username: "sultan1640@gmail.com",
//           credential: "98376683",
//         },
//         {
//           urls: "turn:numb.viagenie.ca",
//           username: "sultan1640@gmail.com",
//           credential: "98376683",
//         },
//       ],
//     },
//   });

//   peer.on("signal", (recSig) => {
//     if (data.renegotiate || data.transceiverRequest) return;
//     console.log(`made signal`);
//     console.log(recSig);
//     socket.emit("callAcceptedRec", {
//       signal: recSig,
//       callerId: data.callerId,
//     });
//     peer.signal(data.signal);
//   });
// });

// socket.on("giveId", (id) => {
//   setuserid(id);

//   db.child("rooms")
//     .child(props.location.state.roomId)
//     .child("socketIds")
//     .child(props.location.state.uid)
//     .set(id);
// });

//*!getting socket ids here */
// db.child("rooms")
//   .child(props.location.state.roomId)
//   .child("socketIds")
//   .get()
//   .then((snapshot) => {
//     if (snapshot.exists()) {
//       setsocketids(snapshot.val());
//     }
//   });

// socket.on("test", () => {
//   console.log("test");
// });
//socket.emit("getId");


//?getting the socket ids
// db.child("rooms")
//   .child(props.location.state.roomId)
//   .child("sockets")
//   .on("value", (snapshot) => {
//     if (snapshot.exists()) {
//       setsocketids(snapshot.val());
//     } else {
//       console.log("Id");
//     }
//   });
