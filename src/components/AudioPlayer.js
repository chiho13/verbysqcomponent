import { useState, useEffect } from "react";

function AudioPlayer({ generatedAudio }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const [seekMax, setSeekMax] = useState(0);

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

  const handleSeek = (event) => {
    if (generatedAudio) {
      generatedAudio.currentTime = event.target.value;
    }
  };

  return (
    <div>
      <button onClick={() => generatedAudio.play()}>Play</button>
      <button onClick={() => generatedAudio.pause()}>Pause</button>
      <button
        onClick={() => {
          generatedAudio.pause();
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
