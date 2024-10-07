import React, { useRef, useEffect } from "react";

const Home = () => {
  const myStreamRef = useRef();
  let stream = null;

  const getMicAndCamera = async () => {
    const constraints = {
      audio: true,
      video: true,
    };

    console.log("myStreamRef = ", myStreamRef.current);

    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("stream = ", stream);

      // Set the video element's srcObject to the stream
      if (myStreamRef.current) {
        myStreamRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  // Cleanup function to stop the stream when the component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div>
      <p>yoo</p>
      <button onClick={getMicAndCamera}>stream</button>
      <br /> <br /> <br />
      <video
        playsinline
        className="w-[900px] h-[600px]"
        autoPlay
        ref={myStreamRef}
      />
    </div>
  );
};

export default Home;
