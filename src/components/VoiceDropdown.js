import { useState, useEffect, memo, useRef } from "react";
import SampleAudioVoice from "./SampleAudioVoice";

function VoiceDropdown({ setSelectedVoiceId }) {
  const voicesDropdownRef = useRef(null);

  const [selectedItemText, setSelectedItemText] = useState("Choose a voice");

  const [voices, setVoices] = useState([]);

  const [playingStates, setPlayingStates] = useState(
    new Array(voices.length).fill(false)
  );

  const [sampleAudioElement, setSampleAudioElement] = useState(null);

  const MemoizedSampleAudioVoice = memo(SampleAudioVoice);

  useEffect(() => {
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

  useEffect(() => {
    fetch("https://verbyttsapi.vercel.app/voices")
      .then((response) => response.json())
      .then((data) => {
        setVoices(data.voices);
        console.log(data);
      })
      .catch((error) => console.error(error));
  }, []);

  function handleVoiceSelection(voice, name) {
    setSelectedVoiceId(voice);
    setSelectedItemText(name);
    voicesDropdownRef.current.classList.remove("show");
  }

  function handleVoicesDropdownClick(event) {
    event.preventDefault();
    event.stopPropagation();
    voicesDropdownRef.current.classList.toggle("show");
  }

  function playAudio(index) {
    if (sampleAudioElement) {
      sampleAudioElement.pause();
    }
    const newAudioElement = new Audio(voices[index].sample);
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

  return (
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
              previewUrl={voice.sample}
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
              onClick={(e) => handleVoiceSelection(voice.voiceId, voice.name)}
            >
              <span className="voiceNameItem">{voice.name}</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VoiceDropdown;
