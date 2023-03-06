import { useState, useEffect, memo, useRef } from "react";
import SampleAudioVoice from "../SampleAudioVoice";
import { VoiceDropdownStyle } from "./style";
import Filter from "../Filter";
import Dropdown from "../Dropdown";

function VoiceDropdown({ setSelectedVoiceId }) {
  const voicesDropdownRef = useRef({});

  const [selectedItemText, setSelectedItemText] = useState("Choose a voice");

  const [voices, setVoices] = useState([]);

  const [accents, setAccents] = useState([]);

  const [playingStates, setPlayingStates] = useState(
    new Array(voices.length).fill(false)
  );

  const [sampleAudioElement, setSampleAudioElement] = useState(null);

  const MemoizedSampleAudioVoice = memo(SampleAudioVoice);

  useEffect(() => {
    fetch("https://verbyttsapi.vercel.app/voices")
      .then((response) => response.json())
      .then((data) => {
        setVoices(data.voices);

        const getAccents = getUniqueAccents(data.voices);
        console.log(getAccents);
        setAccents(getAccents);
      })
      .catch((error) => console.error(error));
  }, []);

  function getUniqueAccents(arr) {
    const accents = Array.from(new Set(arr.map((item) => item.accent)));
    return accents.map((str) => str.charAt(0).toUpperCase() + str.slice(1));
  }

  function handleVoiceSelection(voice, name) {
    setSelectedVoiceId(voice);
    setSelectedItemText(name);
    if (voicesDropdownRef.current && voicesDropdownRef.current.classList) {
      voicesDropdownRef.current.classList.remove("show");
    }
  }

  function playAudio(index) {
    if (sampleAudioElement) {
      sampleAudioElement.currentTime = 0;
      sampleAudioElement.pause();

      const prevIndex = playingStates.findIndex((state) => state);
      if (prevIndex !== -1) {
        setPlayingStates((prevStates) => {
          const newStates = [...prevStates];
          newStates[prevIndex] = false;
          return newStates;
        });
      }
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

  function onFilterChange(option) {
    console.log(option);
  }

  return (
    <VoiceDropdownStyle>
      <Dropdown selectedItemText={selectedItemText} ref={voicesDropdownRef}>
        <div>
          <Filter options={accents} onChange={onFilterChange} />

          <table class="dropdown_table w-full table-auto">
            <thead class="w-full p-4">
              <tr class="voiceTitles">
                <th class="nameHeader text-left">Name</th>
                <th class="text-left">Accent</th>
                <th class="text-left">Age</th>
                <th class="text-left">Style</th>
              </tr>
            </thead>

            <tbody class="w-full">
              {voices.map((voice, index) => (
                <tr
                  key={index}
                  onClick={(e) =>
                    handleVoiceSelection(voice.voiceId, voice.name)
                  }
                  className="voiceItemContainer"
                >
                  <td class="voiceSampleAndName flex items-center">
                    <MemoizedSampleAudioVoice
                      previewUrl={voice.sample}
                      setAudioElement={setSampleAudioElement}
                      isPlaying={playingStates[index]}
                      playAudio={(e) => {
                        e.stopPropagation();
                        playAudio(index);
                      }}
                      stopAudio={(e) => {
                        e.stopPropagation();
                        stopAudio(index);
                      }}
                    />
                    {voice.name}
                  </td>
                  <td>{voice.accent}</td>
                  <td>{voice.age}</td>
                  <td>{voice.style}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Dropdown>
    </VoiceDropdownStyle>
  );
}

export default VoiceDropdown;
