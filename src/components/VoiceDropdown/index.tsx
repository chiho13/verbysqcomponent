import React, {
  useState,
  useEffect,
  memo,
  useRef,
  useMemo,
  useCallback,
  useLayoutEffect,
} from "react";
import SampleAudioVoice from "../SampleAudioVoice";
import { VoiceDropdownStyle } from "./style";
import FilterDropdown from "../FilterDropdown";
import Dropdown from "../Dropdown";
import ChevronDown from "../../icons/ChevronDown";
import { capitalize } from "../../api/util";
import useClickOutsideHandler from "../../hooks/useClickOutside";
import {
  fetchVoices,
  getAccents,
  getAges,
  getVoiceStyles,
  getTempos,
} from "../../api/getVoicesApi";
import { Voice } from "../../types/voice";

// interface Voice {
//   name: string;
//   voiceId: string;
//   accent: string;
//   age: string;
//   style: string;
//   tempo: string;
//   sample: string;
// }

interface FilterOption {
  key: string;
  value: string;
}

interface Filter {
  key: string;
  value: string;
}

interface VoiceDropdownProps {
  setSelectedVoiceId: (voice: string) => void;
}

function VoiceDropdown({ setSelectedVoiceId }: VoiceDropdownProps) {
  const voicesDropdownRef = useRef<any>({});
  const accentFilterRef = useRef<any>({});
  const ageFilterRef = useRef<any>({});
  const voiceStylesFilterRef = useRef<any>({});
  const tempoFilterRef = useRef<any>({});

  const [selectedItemText, setSelectedItemText] =
    useState<string>("Choose a voice");

  const [voices, setVoices] = useState<Voice[]>([]);
  const [accents, setAccents] = useState<string[]>([]);
  const [ages, setAges] = useState<string[]>([]);
  const [voiceStyles, setVoiceStyles] = useState<string[]>([]);
  const [tempos, setTempos] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [selectedFilterOption, setSelectedFilterOption] =
    useState<FilterOption>({ key: "", value: "" });

  const [playingStates, setPlayingStates] = useState<boolean[]>(
    new Array<boolean>(voices.length).fill(false)
  );

  const [sampleAudioElement, setSampleAudioElement] =
    useState<HTMLAudioElement | null>(null);

  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  const MemoizedSampleAudioVoice = memo(SampleAudioVoice);

  const [isOpen, setActiveFilter] = useState<string>("");

  const filteredVoices = useMemo<Voice[]>(() => {
    if (filters.length === 0) {
      return voices;
    }

    let filtered = voices.filter((voice) => {
      return filters.every((filter) => {
        // Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Voice'.
        return voice[filter.key] === filter.value.toLowerCase();
      });
    });

    if (selectedFilterOption.key !== "" && selectedFilterOption.value !== "") {
      filtered = filtered.filter((voice) => {
        return (
          voice[selectedFilterOption.key] ===
          selectedFilterOption.value.toLowerCase()
          // Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Voice'.
        );
      });
    }

    return filtered;
  }, [voices, filters, selectedFilterOption]);

  useEffect(() => {
    fetchVoices()
      .then((voices: Voice[]) => {
        setVoices(voices);
        setAccents(getAccents(voices));
        setAges(getAges(voices));
        setVoiceStyles(getVoiceStyles(voices));
        setTempos(getTempos(voices));
      })
      .catch((error: Error) => console.error(error));
  }, []);

  function handleVoiceSelection(voice: string, name: string): void {
    setSelectedVoiceId(voice);
    setSelectedItemText(name);

    if (voicesDropdownRef.current) {
      voicesDropdownRef.current.handleClose();
    }
  }

  const playAudio = useCallback(
    (index: number): void => {
      if (sampleAudioElement) {
        sampleAudioElement.currentTime = 0;
        sampleAudioElement.pause();

        const prevIndex = playingStates.findIndex((state: boolean) => state);
        if (prevIndex !== -1) {
          setPlayingStates((prevStates: boolean[]) => {
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

      setPlayingStates((prevStates: boolean[]) => {
        const newStates = [...prevStates];
        newStates[index] = true;
        return newStates;
      });

      newAudioElement.addEventListener("ended", () => {
        setPlayingStates((prevStates: boolean[]) => {
          const newStates = [...prevStates];
          newStates[index] = false;
          return newStates;
        });
      });
    },
    [sampleAudioElement, filters, voices, filteredVoices, playingStates]
  );

  const stopAudio = useCallback(
    (index: number): void => {
      if (sampleAudioElement) {
        sampleAudioElement.currentTime = 0;
        sampleAudioElement.pause();
      }
      setPlayingStates((prevStates: boolean[]) => {
        const newStates = [...prevStates];
        newStates[index] = false;
        return newStates;
      });
    },
    [sampleAudioElement]
  );

  interface FilterOption {
    key: string;
    value: string;
  }

  function onFilterChange(option: FilterOption, ref: any): void {
    setSelectedFilterOption(option);
    setFilters((prevFilters: FilterOption[]) => {
      const newFilters = [...prevFilters];
      const { key, value } = option;
      const existingFilterIndex = newFilters.findIndex(
        (filter) => filter.key === key
      );
      if (existingFilterIndex !== -1) {
        newFilters[existingFilterIndex].value = value;
      } else {
        newFilters.push({ key, value });
      }
      return newFilters;
    });

    setActiveFilter("");
  }

  useLayoutEffect(() => {
    setIsFiltering(filteredVoices.length > 0 && filters.length > 0);
  }, [filteredVoices, filters]);

  function clearFilters(): void {
    setIsFiltering(false);
    setFilters([]);
    setSelectedFilterOption({
      key: "",
      value: "",
    });
  }

  function clearIndividualFilter(key: string, value: string): void {
    setFilters((prevFilters: FilterOption[]) => {
      return prevFilters.filter(
        (filter) => filter.key !== key || filter.value !== value
      );
    });

    setSelectedFilterOption((prevSelectedFilterOption: FilterOption) => {
      return prevSelectedFilterOption.key === key &&
        prevSelectedFilterOption.value === value
        ? { key: "", value: "" }
        : prevSelectedFilterOption;
    });
  }

  interface VoiceRowProps {
    voice: Voice;
    index: number;
  }

  const VoiceRow: React.FC<VoiceRowProps> = ({ voice, index }) => {
    const capitalize = (str: string) =>
      str && str.charAt(0).toUpperCase() + str.slice(1);

    return (
      <tr
        key={index}
        onClick={(e) => handleVoiceSelection(voice.voiceId, voice.name)}
        className="voiceItemContainer"
      >
        <td className="voiceSampleAndName flex items-center">
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
  };

  return (
    <VoiceDropdownStyle>
      <Dropdown
        id="voiceDropdown"
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
                  className="filter_reset inline-flex justify-center rounded-md bg-white border-2 border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 outline-none focus:outline-none"
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
                  <th className="nameHeader text-left">Name</th>
                  <th className="text-left">
                    <FilterDropdown
                      id="accent"
                      options={accents}
                      defaultTitle="Accent"
                      onChange={onFilterChange}
                      ref={accentFilterRef}
                      setActiveFilter={setActiveFilter}
                      isOpen={isOpen === "accent"}
                    />
                  </th>
                  <th className="text-left">
                    <FilterDropdown
                      id="age"
                      options={ages}
                      defaultTitle="Age"
                      onChange={onFilterChange}
                      ref={ageFilterRef}
                      setActiveFilter={setActiveFilter}
                      isOpen={isOpen === "age"}
                    />
                  </th>
                  <th className="text-left">
                    <FilterDropdown
                      id="style"
                      options={voiceStyles}
                      defaultTitle="Style"
                      onChange={onFilterChange}
                      ref={voiceStylesFilterRef}
                      setActiveFilter={setActiveFilter}
                      isOpen={isOpen === "style"}
                    />
                  </th>
                  <th className="text-left">
                    <FilterDropdown
                      id="tempo"
                      options={tempos}
                      defaultTitle="Tempo"
                      onChange={onFilterChange}
                      ref={tempoFilterRef}
                      setActiveFilter={setActiveFilter}
                      isOpen={isOpen === "tempo"}
                    />
                  </th>
                </tr>
              </thead>

              <tbody className="w-full">
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
                <div className="filter_noResult">
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
