import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

import "./index.css";

import AudioPlayer from "./components/AudioPlayer";
import VoiceDropdown from "./components/VoiceDropdown";
import LoadingSpinner from "./icons/LoadingSpinner";
import GenerateButton from "./components/GenerateButton";

import { ttsApi } from "./api/ttsApi";

import useStatusPolling from "./hooks/useStatusPolling";
import { ThemeProvider } from "styled-components";

const theme = {
  colors: {
    brand: "#f5820d",
    white: "#ffffff",
  },
  background: {
    white: "linear-gradient(120deg, #fdfbfb 0%, #f2f6f7 100%)",
  },
};

function App() {
  const [selectedVoiceId, setSelectedVoiceId] = React.useState("");

  const [enteredText, setEnteredText] = React.useState("");

  const [audioIsLoading, setAudioIsLoading] = React.useState(false);

  // const [downloadLink, setDownloadLink] = useState(null);

  function handleTextChange(event) {
    setEnteredText(event.target.value);
  }

  const [transcriptionId, setTranscriptionId] = useState("");
  const [status, setStatus] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  // const [generatedAudio, setGeneratedAudio] = useState(null);
  const [generatedAudioElement, setGeneratedAudioElement] = useStatusPolling(
    transcriptionId,
    status,
    setStatus,
    setAudioIsLoading
  );

  const dummyAudioElement = new Audio(
    "https://peregrine-samples.s3.amazonaws.com/editor-samples/anny.wav"
  );

  async function generateAudio(event) {
    event.preventDefault();

    setAudioIsLoading(true);
    setGeneratedAudioElement(null);
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
    <ThemeProvider theme={theme}>
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
            className="textarea_input block w-full mb-4 p-4 resize-none border-gray-300 rounded-md focus:outline-none focus-visible:border-orange-500"
            onChange={handleTextChange}
          ></textarea>
          <GenerateButton
            isDisabled={isDisabled}
            audioIsLoading={audioIsLoading}
            onClick={generateAudio}
          />
        </form>
        <div id="download-container" className="mt-4"></div>
        {!audioIsLoading && generatedAudioElement && (
          <AudioPlayer generatedAudio={generatedAudioElement} />
        )}
        {/* <AudioPlayer generatedAudio={dummyAudioElement} /> */}
        {audioUrl && <DownloadButton audioUrl={audioUrl} />}
      </div>
    </ThemeProvider>
  );
}
window.onload = function () {
  ReactDOM.render(<App />, document.getElementById("app"));
};

export default App;
