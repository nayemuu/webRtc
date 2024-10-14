import { useRef, useEffect } from "react";

const Home = () => {
  const myStreamRef = useRef();
  let mediaStream = null;

  const getMicAndCamera = async () => {
    const constraints = {
      audio: true,
      video: true,
    };

    // console.log("myStreamRef = ", myStreamRef.current);
    console.log("navigator.mediaDevices = ", navigator.mediaDevices);

    try {
      mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("mediaStream = ", mediaStream);

      // Set the video element's srcObject to the stream
      if (myStreamRef.current) {
        myStreamRef.current.srcObject = mediaStream;
      }

      if (mediaStream) {
        const tracks = mediaStream.getTracks();
        console.log("tracks = ", tracks);
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  // Cleanup function to stop the mediaStream when the component unmounts
  useEffect(() => {
    return () => {
      // Cleanup on component unmount
      // mediaStream is a local variable, so React doesn't track it across renders
      // Therefore, there's no point in adding it to the dependency array
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop()); // Stop all tracks
      }
    };
  }, []); // No dependencies: mediaStream is not part of state, so no need to include it here

  return (
    <div>
      <p>WebRtc</p>
      <button onClick={getMicAndCamera}>stream</button>
      <br /> <br /> <br />
      <video playsInline autoPlay ref={myStreamRef} />
    </div>
  );
};

export default Home;
