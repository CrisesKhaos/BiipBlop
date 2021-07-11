import React, { useState, useRef, useEffect } from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import BuildIcon from "@material-ui/icons/Build";

function Dropdown({ data, isHost }) {
  const ref = useRef(null);
  const [drpdwn, setdrpdwn] = useState(false);

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
        <div className="dropdown">Hi</div>
      ) : (
        <div className="dropdown-close"></div>
      )}
      <button
        className="default-btn"
        onClick={() => {
          setdrpdwn(!drpdwn);
        }}
      >
        <MoreVertIcon classname="more-icon" />
      </button>
      <div className="main-things-display">
        <img src={data.pfp} width="100vw" height="100vh" />
        <div className="card-name-display">
          {data.name}
          {isHost ? (
            <BuildIcon style={{ marginLeft: "5px", paddingTop: "4px" }} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Dropdown;
