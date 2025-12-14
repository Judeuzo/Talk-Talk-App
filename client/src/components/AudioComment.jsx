import { useEffect, useRef, useState } from "react";

export default function AudioRecorder({ onRecorded }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioFile, setAudioFile] = useState(null); // 🔥 store file but don't send yet
  const [timer, setTimer] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const intervalRef = useRef(null);
  const audioTagRef = useRef(null);

  
  // Force audio preview reload when URL changes
  useEffect(() => {
    if (audioTagRef.current && audioURL) {
      audioTagRef.current.load();
    }
  }, [audioURL]);

  // 🔥 AUTO-STOP RECORDING AT 10 SECONDS
  useEffect(() => {
    if (isRecording && timer >= 10) {
      stopRecording();
    }
  }, [timer, isRecording]);


  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);

        setAudioURL(url);

        // 🔥 save file internally but DO NOT send yet
        const file = new File([blob], `audio_${Date.now()}.webm`, {
          type: "audio/webm",
        });
        setAudioFile(file);
      };

      mediaRecorder.start();
      setIsRecording(true);

      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);

    } catch (e) {
      alert("Microphone permission required.");
      console.error(e);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    clearInterval(intervalRef.current);
  };


  const deleteRecording = () => {
    setAudioURL(null);
    setAudioFile(null);
    audioChunksRef.current = [];
    setTimer(0);
  };

  const sendRecording = () => {
    if (!audioFile) return alert("No audio to send");

    // 🔥 finally send to parent
    onRecorded({ file: audioFile, duration: timer });

    // Reset UI
    setAudioURL(null);
    setAudioFile(null);
    setTimer(0);
  };

  return (
    <div className="w-full p-4 rounded-lg bg-gray-100 flex flex-col items-center gap-3">

      {/* Timer */}
      {isRecording && (
        <div className="text-red-600 font-semibold text-lg">
          ● Recording... {formatTime(timer)}
        </div>
      )}

      {/* Start Recording */}
      {!isRecording && !audioURL && (
        <button
          onClick={startRecording}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-full"
        >
          Start Recording
        </button>
      )}

      {/* Stop Button */}
      {isRecording && (
        <button
          onClick={stopRecording}
          className="bg-red-700 hover:bg-gray-800 text-white px-5 py-3 rounded-full"
        >
          Stop
        </button>
      )}

      {/* Preview + Buttons */}
      {audioURL && !isRecording && (
        <div className="flex flex-col items-center gap-3 w-full">

          <audio ref={audioTagRef} controls className="w-full">
            <source src={audioURL} type="audio/webm" />
          </audio>

          <div className="flex gap-3">

            <button
              onClick={deleteRecording}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Delete
            </button>

            <button
              onClick={sendRecording}
              className="px-4 py-2 bg-primary rounded-lg"
            >
              Send
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
