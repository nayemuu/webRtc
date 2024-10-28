import { useRef, useEffect, useState } from "react";
import Button from "../../Components/reuseable/Button/Button";

const Home = () => {
  const myStreamRef = useRef();
  const mediaRecorderRef = useRef(null); // Use a ref for mediaRecorder
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false); // Track recording state
  const [isRecordingPushed, setIsRecordingPushed] = useState(false);
  const [isMyMediaResourceActive, setIsMyMediaResourceActive] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);

  const getMicAndCamera = async () => {
    const constraints = {
      audio: true,
      video: true,
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setMediaStream(stream); // Update state with the acquired media stream

      // Set the video element's srcObject to the stream
      if (myStreamRef.current) {
        myStreamRef.current.srcObject = stream;
      }

      setIsMyMediaResourceActive(true);

      // Initialize the MediaRecorder and store it in the ref
      mediaRecorderRef.current = new MediaRecorder(stream);

      //Error Handling for MediaRecorder
      mediaRecorderRef.current.onerror = (event) => {
        console.error("MediaRecorder error:", event.error);
      };

      mediaRecorderRef.current.ondataavailable = (event) => {
        console.log("Data available: ", event.data.size);
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorderRef.current.onstart = () => {
        setIsRecording(true);
        console.log("Recording started");
      };

      mediaRecorderRef.current.onstop = () => {
        setIsRecording(false);
        console.log("Recording stopped");
      };

      mediaRecorderRef.current.onpause = () => {
        console.log("Recording paused");
      };

      mediaRecorderRef.current.onresume = () => {
        setIsRecordingPushed(false);
        console.log("Recording resumed");
      };
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  const startRecording = () => {
    // console.log("mediaRecorderRef.current = ", mediaRecorderRef.current);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.start();
    } else {
      alert("No MediaStream Found!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    } else {
      alert("No MediaStream Found!");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsRecordingPushed(true);
    } else {
      alert("No recording is in progress!");
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isRecordingPushed) {
      mediaRecorderRef.current.resume();
      setIsRecordingPushed(false);
    } else {
      alert("No recording is paused!");
    }
  };

  const downloadRecording = () => {
    // console.log("download");
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

  const stopMediaStream = () => {
    if (mediaStream && !isRecording) {
      mediaStream.getTracks().forEach((track) => track.stop());
      myStreamRef.current.srcObject = null; // Clear the video element
      setIsMyMediaResourceActive(false);
      console.log("Media stream stopped");
    } else {
      console.warn("No media stream to stop");
    }
  };

  // Cleanup function to stop the mediaStream when the component unmounts
  useEffect(() => {
    return () => {
      console.log("Cleaning up...");
      stopMediaStream(); // Ensure media stream is stopped on unmount
    };
  }, []);

  return (
    <div className="container">
      <div className="text-xl font-bold text-center my-5">
        WebRTC with MediaRecorder
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          handleClick={getMicAndCamera}
          active={isMyMediaResourceActive}
        >
          Start Stream
        </Button>

        <Button
          type="button"
          handleClick={isRecording ? stopRecording : startRecording}
          disable={!isMyMediaResourceActive}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>

        <Button
          type="button"
          handleClick={pauseRecording}
          disable={
            !isRecording
              ? true
              : isRecording && !isRecordingPushed
              ? false
              : true
          }
        >
          Pause Recording
        </Button>

        <Button
          type="button"
          handleClick={resumeRecording}
          disable={
            !isRecording
              ? true
              : isRecording && isRecordingPushed
              ? false
              : true
          }
        >
          Resume Recording
        </Button>

        <Button
          type="button"
          handleClick={downloadRecording}
          disable={recordedChunks.length ? false : true}
        >
          Download Recording
        </Button>

        <Button
          type="button"
          handleClick={stopMediaStream}
          disable={!isMyMediaResourceActive || isRecording}
        >
          Stop Stream
        </Button>
      </div>

      <div className="flex justify-center my-4">
        <video playsInline autoPlay ref={myStreamRef} />
      </div>
    </div>
  );
};

export default Home;

//make a stop maidaStream Handler
