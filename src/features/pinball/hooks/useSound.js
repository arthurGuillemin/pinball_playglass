import { useRef, useCallback } from "react";

const SOUNDS = {
  launcher: "/sounds/launcher.wav",
  bumper: "sounds/bumper.wav",
  slingshot: "sounds/slingshot.wav",
  flippersUP: "sounds/flippersUP.wav",
  flippersDOWN: "sounds/flippersDOWN.wav",
  death: "sounds/death.wav",
  light: "sounds/light.wav",
  tube: "sounds/tube.wav",
};

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const bufferCache = {};

async function loadSound(key) {
  if (bufferCache[key]) return bufferCache[key];
  const response = await fetch(SOUNDS[key]);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  bufferCache[key] = audioBuffer;
  return audioBuffer;
}

export function useSound() {
  const play = useCallback(async (key, volume = 1) => {
    if (!SOUNDS[key]) {
      console.warn(`[Sound] Son inconnu : ${key}`);
      return;
    }
    try {
      const buffer = await loadSound(key);
      const source = audioCtx.createBufferSource();
      const gainNode = audioCtx.createGain();
      gainNode.gain.value = Math.min(Math.max(volume, 0), 1);
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      source.start(0);
    } catch (err) {
      console.warn(`[Sound] Erreur lecture ${key}:`, err.message);
    }
  }, []);

  const preload = useCallback(async (key) => {
    if (!SOUNDS[key]) return;
    await loadSound(key);
  }, []);

  return { play, preload };
}
