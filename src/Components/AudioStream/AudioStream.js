import React, { useEffect, useState, useRef } from "react";

//*? ownerId is the id whos sending //whos audio we reciveing */

function AudioStream({ audioStream, ownerId }) {
  const audio = useRef();

  useEffect(() => {
    if (audio.current) audio.current.srcObject = audioStream;
  });
  return (
    <div>
      <video ref={audio} playsInline autoplay />
    </div>
  );
}

export default AudioStream;
