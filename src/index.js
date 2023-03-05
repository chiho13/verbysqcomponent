import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "./index.css";

import SampleAudioVoice from "./components/SampleAudioVoice";
import AudioPlayer from "./components/AudioPlayer";
import VoiceDropdown from "./components/VoiceDropdown";

function App() {
  const [selectedItemText, setSelectedItemText] =
    React.useState("Choose a voice");
  const [selectedVoiceId, setSelectedVoiceId] = React.useState("");

  const [enteredText, setEnteredText] = React.useState("");

  const [audioIsLoading, setAudioIsLoading] = React.useState(false);

  // const [generatedAudio, setGeneratedAudio] = React.useState(null);
  const [downloadLink, setDownloadLink] = useState(null);

  const dropdownMenu = document.getElementById("menuItems");

  function handleTextChange(event) {
    setEnteredText(event.target.value);
  }

  const [transcriptionId, setTranscriptionId] = useState("");
  const [status, setStatus] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const [generatedAudio, setGeneratedAudio] = useState(null);

  useEffect(() => {
    // Start polling for status updates
    const interval = setInterval(async () => {
      if (transcriptionId) {
        try {
          const response = await fetch(
            `http://localhost:3000/articleStatus/${transcriptionId}`
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
            clearInterval(interval);
          }
        } catch (error) {
          console.error("Error fetching transcription status:", error);
          // TODO: Handle error (e.g. show error message to user)
        }
      }
    }, 1000);

    // Stop polling when the component unmounts
    return () => clearInterval(interval);
  }, [transcriptionId, status]);

  async function generateAudio(event) {
    event.preventDefault();

    setAudioIsLoading(true);
    setGeneratedAudio(null);
    setStatus(false);
    setTranscriptionId("");

    console.log(enteredText);
    const requestBody = {
      voice: selectedVoiceId,
      content: [enteredText],
    };

    console.log(selectedVoiceId);

    try {
      const response = await fetch("https://verbyttsapi.vercel.app/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
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

  const MemoizedSampleAudioVoice = React.memo(SampleAudioVoice);

  return (
    <div className="container p-4 mx-auto max-w-screen-lg ">
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
          class={`generateAudio flex items-center ${isDisabled && "disabled"}`}
          onClick={generateAudio}
          disabled={audioIsLoading}
        >
          {audioIsLoading ? (
            <>
              <svg
                aria-hidden="true"
                role="status"
                class="spinning-icon inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#aaaaaa"
                  strokeWidth="3"
                  strokeLinecap="round"
                  d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
                >
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    dur="1s"
                    from="0 50 50"
                    to="360 50 50"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
              <div>Loading...</div>
            </>
          ) : (
            <div>Generate</div>
          )}
        </button>
      </form>
      <div id="download-container" className="mt-4"></div>
      {/* {audioUrl && (
        <audio src={audioUrl} controls crossOrigin="anonymous" autoPlay />
      )} */}

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
