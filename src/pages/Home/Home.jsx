import { useRef, useEffect, useState } from "react";

const Home = () => {
  const myStreamRef = useRef();
  const mediaRecorderRef = useRef(null); // Use a ref for mediaRecorder
  let mediaStream = null;
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false); // Track recording state

  const getMicAndCamera = async () => {
    const constraints = {
      audio: true,
      video: true,
    };

    try {
      mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      // Set the video element's srcObject to the stream
      if (myStreamRef.current) {
        myStreamRef.current.srcObject = mediaStream;
      }

      // Initialize the MediaRecorder and store it in the ref
      mediaRecorderRef.current = new MediaRecorder(mediaStream);

      // Capture data in chunks when recording
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  const startRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log("Recording started");
    } else {
      alert("No MediaStream Found!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log("Recording stopped");
    } else {
      alert("No MediaStream Found!");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsRecording(false);
      console.log("Recording paused");
    } else {
      alert("No recording is in progress!");
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && !isRecording) {
      mediaRecorderRef.current.resume();
      setIsRecording(true);
      console.log("Recording resumed");
    } else {
      alert("No recording is paused!");
    }
  };

  const downloadRecording = () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "recording.webm";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      setRecordedChunks([]); // Clear the recorded chunks
    }
  };

  // Cleanup function to stop the mediaStream when the component unmounts
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <p>WebRTC with MediaRecorder</p>
      <button onClick={getMicAndCamera}>Start Stream</button>
      <button onClick={startRecording}>Start Recording</button>
      {/* <button onClick={stopRecording}>Stop Recording</button> */}
      <button onClick={pauseRecording}>Pause Recording</button>
      <button onClick={resumeRecording}>Resume Recording</button>
      <button onClick={downloadRecording}>Download Recording</button>
      <br /> <br /> <br />
      <video playsInline autoPlay ref={myStreamRef} />
    </div>
  );
};

export default Home;
