import { getUniqueValues } from "./util";

export async function fetchVoices() {
  const response = await fetch("https://verbyttsapi.vercel.app/voices");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.voices;
}

export function getAccents(voices) {
  return getUniqueValues(voices, "accent");
}

export function getAges(voices) {
  return getUniqueValues(voices, "age");
}

export function getVoiceStyles(voices) {
  return getUniqueValues(voices, "style");
}

export function getTempos(voices) {
  return getUniqueValues(voices, "tempo");
}
