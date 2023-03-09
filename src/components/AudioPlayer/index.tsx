import { useState, useEffect } from "react";

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

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (generatedAudio) {
      generatedAudio.currentTime = Number(event.target.value);
    }
  };

  return (
    <div>
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
      <input
        type="range"
        min="0"
        max={seekMax}
        step="0.01"
        value={seekValue}
        onChange={handleSeek}
      />
    </div>
  );
}

export default AudioPlayer;
