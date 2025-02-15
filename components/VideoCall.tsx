"use client"; // Ensures it runs only on the client side

import AgoraUIKit from "agora-react-uikit";
import { useState } from "react";

const VideoCall = () => {
  const [isCalling, setIsCalling] = useState(false);

  const rtcProps = {
    appId: "d57c4e903e5c40658548b0b1e0f5e7f5", // Replace with your actual App ID
    channel: "test",
    token: null, // If you have a token, replace null with it
  };

  return (
    <div>
      {isCalling ? (
        <div>
          <AgoraUIKit rtcProps={rtcProps} />
          <button
            onClick={() => setIsCalling(false)}
            className="bg-red-500 text-white p-2 rounded"
          >
            End Call
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsCalling(true)}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Start Video Call
        </button>
      )}
    </div>
  );
};

export default VideoCall;
