import React from "react";
import ReactDOM from "react-dom";
import "./Room_Popup.css";
function Room_Popup({ open, setopen, data, setid }) {
  console.log("Modal Open");
  if (!open) return null;
  else
    return ReactDOM.createPortal(
      <div className="modal-overlay" onClick={() => setopen(false)}>
        <div className="modal-card">
          {data.map((vid) => {
            return (
              <div
                key={vid.id.videoId}
                className="modal-item"
                onClick={() => setid(vid.id.videoId)}
              >
                <img src={vid.snippet.thumbnails.default.url} alt="Thumbnail" />
                <div>
                  <div className="modal-title">{vid.snippet.title}</div>
                  <div className="modal-channel-name">
                    {vid.snippet.channelTitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>,
      document.getElementById("portal")
    );
}

export default Room_Popup;
