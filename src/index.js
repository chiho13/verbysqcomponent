import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

import "./index.css";

import AudioPlayer from "./components/AudioPlayer";
import VoiceDropdown from "./components/VoiceDropdown";
import LoadingSpinner from "./components/LoadingSpinner";
import { ttsApi } from "./api/ttsApi";

function App() {
  const [selectedVoiceId, setSelectedVoiceId] = React.useState("");

  const [enteredText, setEnteredText] = React.useState("");

  const [audioIsLoading, setAudioIsLoading] = React.useState(false);

  // const [generatedAudio, setGeneratedAudio] = React.useState(null);
  const [downloadLink, setDownloadLink] = useState(null);

  function handleTextChange(event) {
    setEnteredText(event.target.value);
  }

  const [transcriptionId, setTranscriptionId] = useState("");
  const [status, setStatus] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const [generatedAudio, setGeneratedAudio] = useState(null);

  const intervalRef = useRef(null);

  useEffect(() => {
    // Clear previous interval
    clearInterval(intervalRef.current);

    // Start polling for status updates
    intervalRef.current = setInterval(async () => {
      if (transcriptionId) {
        try {
          const response = await fetch(
            `https://verbyttsapi.vercel.app/articleStatus/${transcriptionId}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log(data);

          setStatus(data.transcriped);

          if (status && data.audioUrl && data.audioUrl.length > 0) {
            const newAudioElement = new Audio(data.audioUrl[0]);
            newAudioElement.addEventListener("error", (e) => {
              console.error("Error playing audio:", e);
            });
            // newAudioElement.play();
            setGeneratedAudio(newAudioElement);
            setAudioIsLoading(false);
          }

          // Clear the interval when transcription is complete
          if (data.transcriped) {
            clearInterval(intervalRef.current);
          }
        } catch (error) {
          console.error("Error fetching transcription status:", error);
          // TODO: Handle error (e.g. show error message to user)
        }
      }
    }, 1000);

    // Stop polling when the component unmounts or the transcriptionId or status changes
    return () => clearInterval(intervalRef.current);
  }, [transcriptionId, status]);

  async function generateAudio(event) {
    event.preventDefault();

    setAudioIsLoading(true);
    setGeneratedAudio(null);
    setStatus(false);
    setTranscriptionId("");

    const requestBody = {
      voice: selectedVoiceId,
      content: [enteredText],
    };

    try {
      const data = await ttsApi(requestBody);
      console.log(data);
      setTranscriptionId(data.transcriptionId);
    } catch (error) {
      console.error(error);
    }
  }

  function DownloadButton({ audioUrl }) {
    const handleDownload = async () => {
      try {
        const response = await fetch(audioUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "synthesised-audio.wav";
        link.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error(error);
        alert("Error downloading audio file. Please try again later.");
      }
    };

    return (
      <button
        className="mt-4 inline-flex justify-center rounded-md border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-opacity-50 focus-visible:outline-none"
        onClick={handleDownload}
      >
        Download
      </button>
    );
  }

  const [isDisabled, setIsDisabled] = React.useState(true);

  React.useEffect(() => {
    if (selectedVoiceId && enteredText) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [selectedVoiceId, enteredText]);

  return (
    <div className="container p-4 mx-auto">
      <VoiceDropdown setSelectedVoiceId={setSelectedVoiceId} />

      <form id="text-form">
        <label htmlFor="text" className="block mb-2">
          Enter text (max. 1000 characters):
        </label>
        <textarea
          id="text"
          name="text"
          rows="8"
          cols="50"
          maxLength="1000"
          className="textarea_input block w-full mb-4 bg-gray-100 p-4 resize-none border-gray-300 border-2 rounded-md focus:outline-none focus-visible:border-orange-500"
          onChange={handleTextChange}
        ></textarea>
        <button
          class={`generateAudio_button flex items-center ${
            isDisabled && "disabled"
          }`}
          onClick={generateAudio}
          disabled={audioIsLoading}
        >
          {audioIsLoading ? (
            <>
              <LoadingSpinner />
              <div>Generating...</div>
            </>
          ) : (
            <div>Generate</div>
          )}
        </button>
      </form>
      <div id="download-container" className="mt-4"></div>
      {!audioIsLoading && generatedAudio && (
        <AudioPlayer generatedAudio={generatedAudio} />
      )}
      {audioUrl && <DownloadButton audioUrl={audioUrl} />}
    </div>
  );
}
window.onload = function () {
  ReactDOM.render(<App />, document.getElementById("app"));
};

export default App;
