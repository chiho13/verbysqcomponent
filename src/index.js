import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import SampleAudioVoice from "./components/SampleAudioVoice";
import { useCallback } from "react/cjs/react.production.min";

function App() {
  const [selectedItemText, setSelectedItemText] =
    React.useState("Choose a voice");
  const [selectedVoiceId, setSelectedVoiceId] = React.useState("");

  const [sampleSrc, setSampleSrc] = React.useState("");

  const [sampleAudioElement, setSampleAudioElement] = React.useState(null);

  const [voices, setVoices] = React.useState([]);

  const [enteredText, setEnteredText] = React.useState("");

  const voicesDropdownRef = React.useRef(null);

  const sampleAudioRef = React.useRef(null);

  const [audioIsLoading, setAudioIsLoading] = React.useState(false);

  function handleVoicesDropdownClick(event) {
    event.preventDefault();
    event.stopPropagation();
    voicesDropdownRef.current.classList.toggle("show");
  }

  const dropdownMenu = document.getElementById("menuItems");

  function handleVoiceSelection(voice, name) {
    setSelectedVoiceId(voice);
    setSelectedItemText(name);
    voicesDropdownRef.current.classList.remove("show");
  }

  const [playingStates, setPlayingStates] = React.useState(
    new Array(voices.length).fill(false)
  );

  function handleTextChange(event) {
    setEnteredText(event.target.value);
  }

  function playAudio(index) {
    if (sampleAudioElement) {
      sampleAudioElement.pause();
    }
    const newAudioElement = new Audio(voices[index].preview_url);
    newAudioElement.play();
    setSampleAudioElement(newAudioElement);
    //   setIsPlaying(true);
    setPlayingStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = true;
      return newStates;
    });

    newAudioElement.addEventListener("ended", () => {
      setPlayingStates((prevStates) => {
        const newStates = [...prevStates];
        newStates[index] = false;
        return newStates;
      });
    });
  }

  function stopAudio(index) {
    if (sampleAudioElement) {
      sampleAudioElement.currentTime = 0;
      sampleAudioElement.pause();
    }
    setPlayingStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = false;
      return newStates;
    });
  }

  function generateAudio(event) {
    event.preventDefault();

    setAudioIsLoading(true);
    const requestBody = {
      text: enteredText,
      voice_settings: {
        stability: 0,
        similarity_boost: 0,
      },
    };

    console.log(selectedVoiceId);
  }

  React.useEffect(() => {
    fetch("http://localhost:3000/voices")
      .then((response) => response.json())
      .then((data) => {
        setVoices(data.voices);
        console.log(data.voices);
      })
      .catch((error) => console.error(error));
  }, []);

  React.useEffect(() => {
    const handleClickOutsideDropdown = (event) => {
      if (
        voicesDropdownRef.current &&
        !voicesDropdownRef.current.contains(event.target) &&
        event.target.tagName !== "svg"
      ) {
        voicesDropdownRef.current.classList.remove("show");
      }
    };

    document.addEventListener("click", handleClickOutsideDropdown);

    return () => {
      document.removeEventListener("click", handleClickOutsideDropdown);
    };
  }, [voicesDropdownRef]);

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
      <div className="dropdown">
        <div>
          <button
            className="dropdown-toggle inline-flex justify-center rounded-md border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-opacity-50 focus-visible:outline-none"
            aria-expanded="true"
            aria-haspopup="true"
            id="voices-dropdown"
            onClick={handleVoicesDropdownClick}
          >
            <span> {selectedItemText}</span>
            <svg
              class="-mr-1 ml-2 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div
          id="menuItems"
          className="dropdown-menu absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="voices-dropdown"
          tabIndex="-1"
          ref={voicesDropdownRef}
        >
          {voices.map((voice, index) => (
            <div class="flex py-2 voiceItemContainer">
              <MemoizedSampleAudioVoice
                key={index}
                previewUrl={voice.preview_url}
                setAudioElement={setSampleAudioElement}
                isPlaying={playingStates[index]}
                playAudio={() => playAudio(index)}
                stopAudio={() => stopAudio(index)}
              />
              <a
                href="#"
                className="flex items-center text-gray-700 block px-2 py-2 text-sm w-full"
                role="menuitem"
                tabIndex="-1"
                id="single-menu-item"
                onClick={(e) =>
                  handleVoiceSelection(voice.voice_id, voice.name)
                }
              >
                <span className="voiceNameItem">{voice.name}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      <audio
        id="sample-audio"
        ref={sampleAudioRef}
        class="block mb-4"
        src={sampleSrc}
        style={{ display: "none" }}
      ></audio>

      <audio
        id="generated-audio"
        controls
        className="block mb-4"
        style={{ display: "none" }}
      ></audio>
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
          className="textarea_input block w-full mb-4 bg-gray-100 p-4 resize-none border-gray-500 border-2 rounded-md focus:outline-none focus-visible:border-orange-500"
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
    </div>
  );
}

window.onload = function () {
  ReactDOM.render(<App />, document.getElementById("app"));
};

export default App;
