"use client";

import AgoraUIKit from "agora-react-uikit";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const VideoCallPage = () => {
  const [videoCall, setVideoCall] = useState(true);

  const rtcProps = {
    appId: "d57c4e903e5c40658548b0b1e0f5e7f5",
    channel: "test",
    token: null, // Use a valid token if required
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      {videoCall ? (
        <div className="relative w-full h-[600px] border-2 border-gray-300 rounded-lg overflow-hidden">
          <AgoraUIKit rtcProps={rtcProps} />
          <Button
            className="absolute bottom-4 right-4 bg-red-500 text-white"
            onClick={() => window.close()} // Closes the tab when the call ends
          >
            End Call
          </Button>
        </div>
      ) : (
        <p>Call Ended</p>
      )}
    </div>
  );
};

export default VideoCallPage;
