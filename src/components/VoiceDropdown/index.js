import { useState, useEffect, memo, useRef, useMemo, useCallback } from "react";
import SampleAudioVoice from "../SampleAudioVoice";
import { VoiceDropdownStyle } from "./style";
import Filter from "../Filter";
import Dropdown from "../Dropdown";
import ChevronDown from "../../icons/ChevronDown";
import { capitalize } from "../../util/capitalise";
function VoiceDropdown({ setSelectedVoiceId }) {
  const voicesDropdownRef = useRef({});
  const accentFilterRef = useRef({});
  const ageFilterRef = useRef({});
  const voiceStylesFilterRef = useRef({});
  const tempoFilterRef = useRef({});

  const [selectedItemText, setSelectedItemText] = useState("Choose a voice");

  const [voices, setVoices] = useState([]);
  // const [filteredVoices, setFilteredVoices] = useState([]);

  const [accents, setAccents] = useState([]);
  const [ages, setAges] = useState([]);
  const [voiceStyles, setVoiceStyles] = useState([]);
  const [tempos, setTempos] = useState([]);

  const [playingStates, setPlayingStates] = useState(
    new Array(voices.length).fill(false)
  );

  const [filters, setFilters] = useState([]);

  const [selectedFilterOption, setSelectedFilterOption] = useState({
    key: "",
    value: "",
  });

  const [sampleAudioElement, setSampleAudioElement] = useState(null);

  const [isFiltering, setIsFiltering] = useState(false);

  const MemoizedSampleAudioVoice = memo(SampleAudioVoice);

  const filteredVoices = useMemo(() => {
    if (filters.length === 0) {
      return voices;
    }

    let filtered = voices.filter((voice) => {
      return filters.every((filter) => {
        return voice[filter.key] === filter.value.toLowerCase();
      });
    });

    if (selectedFilterOption.key !== "" && selectedFilterOption.value !== "") {
      filtered = filtered.filter((voice) => {
        return (
          voice[selectedFilterOption.key] ===
          selectedFilterOption.value.toLowerCase()
        );
      });
    }

    return filtered;
  }, [voices, filters, selectedFilterOption]);

  useEffect(() => {
    fetch("https://verbyttsapi.vercel.app/voices")
      .then((response) => response.json())
      .then((data) => {
        setVoices(data.voices);

        console.log(voices);
        const getAccents = getUniqueValues(data.voices, "accent");
        const getAges = getUniqueValues(data.voices, "age");
        const getVoiceStyles = getUniqueValues(data.voices, "style");
        const getTempos = getUniqueValues(data.voices, "tempo");
        console.log(getAccents);
        console.log(getAges);
        setAccents(getAccents);
        setAges(getAges);
        setVoiceStyles(getVoiceStyles);
        setTempos(getTempos);
      })
      .catch((error) => console.error(error));
  }, []);

  function getUniqueValues(arr, key) {
    const uniqueValues = Array.from(new Set(arr.map((item) => item[key])));
    return uniqueValues.map((value) => {
      return {
        key: key,
        value: value.charAt(0).toUpperCase() + value.slice(1),
      };
    });
  }

  function handleVoiceSelection(voice, name) {
    setSelectedVoiceId(voice);
    setSelectedItemText(name);
    if (voicesDropdownRef.current && voicesDropdownRef.current.classList) {
      voicesDropdownRef.current.classList.remove("show");
    }
  }

  const playAudio = useCallback(
    (index) => {
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
      let newAudioElement = null;
      if (filters.length > 0) {
        newAudioElement = new Audio(filteredVoices[index].sample);
      } else {
        newAudioElement = new Audio(voices[index].sample);
      }

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
    },
    [sampleAudioElement, filters, voices, filteredVoices, playingStates]
  );

  const stopAudio = useCallback(
    (index) => {
      if (sampleAudioElement) {
        sampleAudioElement.currentTime = 0;
        sampleAudioElement.pause();
      }
      setPlayingStates((prevStates) => {
        const newStates = [...prevStates];
        newStates[index] = false;
        return newStates;
      });
    },
    [sampleAudioElement]
  );

  function onFilterChange(option, ref) {
    // Otherwise, filter the voices array by the selected accent value
    console.log(option);
    setSelectedFilterOption(option);
    setFilters((prevFilters) => {
      const newFilters = [...prevFilters];
      const { key, value } = option;
      const existingFilterIndex = newFilters.findIndex(
        (filter) => filter.key === key
      );
      if (existingFilterIndex !== -1) {
        // If a filter with this key already exists, update its value
        newFilters[existingFilterIndex].value = value;
      } else {
        // Otherwise, add a new filter
        newFilters.push({ key, value });
      }
      return newFilters;
    });

    ref.current.classList.remove("show");
  }

  useEffect(() => {
    setIsFiltering(filteredVoices.length > 0 && filters.length > 0);
  }, [filteredVoices, filters]);

  function clearFilters() {
    setIsFiltering(false);
    setFilters([]);
    setSelectedFilterOption({
      key: "",
      value: "",
    });
  }

  function clearIndividualFilter(key, value) {
    setFilters((prevFilters) => {
      return prevFilters.filter(
        (filter) => filter.key !== key || filter.value !== value
      );
    });

    setSelectedFilterOption((prevSelectedFilterOption) => {
      return prevSelectedFilterOption.key === key &&
        prevSelectedFilterOption.value === value
        ? { key: "", value: "" }
        : prevSelectedFilterOption;
    });
  }

  function VoiceRow({ voice, index }) {
    const capitalize = (str) =>
      str && str.charAt(0).toUpperCase() + str.slice(1);
    return (
      <tr
        key={index}
        onClick={(e) => handleVoiceSelection(voice.voiceId, voice.name)}
        className="voiceItemContainer"
      >
        <td class="voiceSampleAndName flex items-center">
          <MemoizedSampleAudioVoice
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
        <td>{capitalize(voice.accent)}</td>
        <td>{capitalize(voice.age)}</td>
        <td>{capitalize(voice.style)}</td>
        <td>{capitalize(voice.tempo)}</td>
      </tr>
    );
  }

  return (
    <VoiceDropdownStyle>
      <Dropdown
        selectedItemText={selectedItemText}
        ref={voicesDropdownRef}
        icon={<ChevronDown />}
        minHeight={450}
      >
        <div>
          <div>
            {filters.length > 0 && (
              <div className="filter_label inline-flex justify-center bg-white px-4 py-2 text-sm font-medium text-gray-700 ">
                <div>
                  <span>Filters:</span>

                  {filters.map((filter) => {
                    const { key, value } = filter;
                    return (
                      <span
                        key={`${key}-${value}`}
                        className="filter_pill inline-flex items-center text-sm font-medium bg-gray-100 text-gray-800 mr-2"
                      >
                        {`${capitalize(key)}: ${value}`}
                        {/* using string interpolation */}
                        <button
                          className="ml-2 focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearIndividualFilter(key, value);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="close-icon w-4 h-4 text-gray-500 fill-current"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    );
                  })}
                </div>

                <button
                  class="filter_reset inline-flex justify-center rounded-md bg-white border-2 border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 outline-none focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFilters();
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
          <div className="dropdown_table_wrapper">
            <table className="dropdown_table w-full table-auto">
              <thead className="voiceTitles w-full p-4">
                <tr>
                  <th class="nameHeader text-left">Name</th>
                  <th class="text-left">
                    <Filter
                      options={accents}
                      defaultTitle="Accent"
                      onChange={onFilterChange}
                      ref={accentFilterRef}
                    />
                  </th>
                  <th class="text-left">
                    <Filter
                      options={ages}
                      defaultTitle="Age"
                      onChange={onFilterChange}
                      ref={ageFilterRef}
                    />
                  </th>
                  <th class="text-left">
                    <Filter
                      options={voiceStyles}
                      defaultTitle="Style"
                      onChange={onFilterChange}
                      ref={voiceStylesFilterRef}
                    />
                  </th>
                  <th class="text-left">
                    <Filter
                      options={tempos}
                      defaultTitle="Tempo"
                      onChange={onFilterChange}
                      ref={tempoFilterRef}
                    />
                  </th>
                </tr>
              </thead>

              <tbody class="w-full">
                {isFiltering &&
                  filteredVoices.map((voice, index) => (
                    <VoiceRow
                      voice={voice}
                      key={index}
                      index={index}
                      playAudio={playAudio}
                      stopAudio={stopAudio}
                    />
                  ))}

                {!isFiltering &&
                  filters.length === 0 &&
                  voices.map((voice, index) => (
                    <VoiceRow
                      voice={voice}
                      key={index}
                      index={index}
                      playAudio={playAudio}
                      stopAudio={stopAudio}
                    />
                  ))}
              </tbody>
            </table>

            {!isFiltering &&
              !(filters.length > 0 && filteredVoices.length > 0) && (
                <div class="filter_noResult">
                  No Voices found for selected filters
                </div>
              )}
          </div>
        </div>
      </Dropdown>
    </VoiceDropdownStyle>
  );
}

export default VoiceDropdown;
