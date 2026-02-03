"use client";

import React, { useRef, useState } from "react";
import { morseCodeMap } from "@/lib/morseCode";

type ReceivePlaygroundProps = {
  target: string;
  dotLength?: number; // ms
  onSubmit?: (text: string) => void;
};

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export default function ReceivePlayground({
  target,
  dotLength = 100,
  onSubmit,
}: ReceivePlaygroundProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [guess, setGuess] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    return audioContextRef.current;
  };

  const playTone = async (duration: number) => {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.001);
    osc.start();
    await sleep(duration);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.01);
    try {
      osc.stop();
    } catch (e) {
      // ignore
    }
    osc.disconnect();
    gain.disconnect();
  };

  const playMorseFor = async (word: string) => {
    if (!word) return;
    setIsPlaying(true);

    const DOT = dotLength;
    const DASH = DOT * 3;
    const INTRA = DOT; // gap between symbols
    const LETTER_GAP = DOT * 3;

    // Ensure audio context resumed on user gesture
    const ctx = initAudio();
    if (ctx.state === "suspended") await ctx.resume();

    const normalized = word.toUpperCase().replace(/[^A-Z0-9]/g, "");

    for (let i = 0; i < normalized.length; i++) {
      const ch = normalized[i];
      const code = morseCodeMap[ch];
      if (!code) continue;
      for (let j = 0; j < code.length; j++) {
        const sym = code[j];
        if (sym === ".") {
          await playTone(DOT);
        } else if (sym === "-") {
          await playTone(DASH);
        }
        // gap between symbols
        if (j < code.length - 1) await sleep(INTRA);
      }
      // gap between letters
      if (i < normalized.length - 1) await sleep(LETTER_GAP);
    }

    setIsPlaying(false);
  };

  // Auto-play when a new target is provided
  React.useEffect(() => {
    if (target) {
      void playMorseFor(target);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  const doSubmit = () => {
    if (onSubmit) onSubmit(guess || "");
    setGuess("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      doSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <button
          disabled={isPlaying}
          onClick={() => void playMorseFor(target)}
          className={`px-4 py-2 rounded text-white ${isPlaying ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {isPlaying ? "Playing…" : "Play Again"}
        </button>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input
          ref={(el) => {
            inputRef.current = el;
          }}
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type what you heard"
          className="px-3 py-2 border rounded text-black"
        />
        <button
          onClick={doSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
