import { useState, useEffect } from "react";

import { AudioPlayerStyle } from "./style";

interface Props {
  generatedAudio: HTMLAudioElement | null;
}

function AudioPlayer({ generatedAudio }: Props): JSX.Element {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [seekValue, setSeekValue] = useState<number>(0);
  const [seekMax, setSeekMax] = useState<number>(0);

  useEffect(() => {
    if (generatedAudio) {
      const handleTimeUpdate = () => {
        setSeekValue(generatedAudio.currentTime);
      };

      const handleLoadedMetadata = () => {
        setSeekMax(generatedAudio.duration);
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      generatedAudio.addEventListener("timeupdate", handleTimeUpdate);
      generatedAudio.addEventListener("loadedmetadata", handleLoadedMetadata);
      generatedAudio.addEventListener("play", handlePlay);
      generatedAudio.addEventListener("pause", handlePause);

      return () => {
        generatedAudio.removeEventListener("timeupdate", handleTimeUpdate);
        generatedAudio.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        generatedAudio.removeEventListener("play", handlePlay);
        generatedAudio.removeEventListener("pause", handlePause);
      };
    }
  }, [generatedAudio]);

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (generatedAudio) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const width = rect.width;
      const percent = x / width;
      generatedAudio.currentTime = percent * generatedAudio.duration;
      setSeekValue(generatedAudio.currentTime);
    }
  };

  return (
    <AudioPlayerStyle>
      <div className="audioPlayer_timeline" onClick={handleSeek}>
        <div
          style={{
            width: `${(seekValue / seekMax) * 100}%`,
            height: "5px",
            backgroundColor: "#f5820d",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        ></div>
      </div>
      <button onClick={() => generatedAudio?.play()}>Play</button>
      <button onClick={() => generatedAudio?.pause()}>Pause</button>
      <button
        onClick={() => {
          generatedAudio?.pause();
          generatedAudio.currentTime = 0;
        }}
      >
        Stop
      </button>
    </AudioPlayerStyle>
  );
}

export default AudioPlayer;
