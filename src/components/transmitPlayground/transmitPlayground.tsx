"use client";

import { useState, useEffect, useRef } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { morseToCharMap } from "@/lib/morseCode";

type TransmitPlaygroundProps = {
  onSubmit?: (text: string) => void;
};

const TransmitPlayground = ({ onSubmit }: TransmitPlaygroundProps) => {
  const [displayText, setDisplayText] = useState<string>("");
  const [currentMorse, setCurrentMorse] = useState<string>("");
  const [isPressed, setIsPressed] = useState(false);
  const [pressStartTime, setPressStartTime] = useState<number | null>(null);
  const [pressProgress, setPressProgress] = useState(0);
  const [showBar, setShowBar] = useState(true);
  const [lastReleaseTime, setLastReleaseTime] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // Timing constants (in milliseconds) - based on dot length
  const DOT_LENGTH = 100; // One dot unit
  const DASH_LENGTH = DOT_LENGTH * 3; // Dash is 3 dots
  const LETTER_GAP = DOT_LENGTH * 3; // 3 dot gaps = space between letters
  const CLEAR_GAP = DOT_LENGTH * 50; // 50+ dot gaps = clear display

  // Initialize audio context
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    return audioContextRef.current;
  };

  // Play beep sound
  const playBeep = () => {
    const audioContext = initAudioContext();
    if (!oscillatorRef.current) {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // Frequency in Hz
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

      oscillator.start();
      oscillatorRef.current = oscillator;
    }
  };

  // Stop beep sound
  const stopBeep = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (!isPressed) {
          setIsPressed(true);
          setPressStartTime(Date.now());
          playBeep();
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (isPressed && pressStartTime) {
          stopBeep();
          const pressDuration = Date.now() - pressStartTime;

          // Determine if it's a dot or dash
          let symbol = "";
          if (pressDuration <= DASH_LENGTH) {
            // Valid press
            if (pressDuration < DASH_LENGTH / 2) {
              symbol = ".";
            } else {
              symbol = "-";
            }
            setCurrentMorse((prev) => prev + symbol);
          }

          // If longer than dash length, it's invalid - ignore it
          const releaseTime = Date.now();
          setLastReleaseTime(releaseTime);
          setIsPressed(false);
          setPressStartTime(null);
          setPressProgress(0);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isPressed, pressStartTime, DASH_LENGTH, playBeep, stopBeep]);

  // Update progress bar while key is pressed
  useEffect(() => {
    let animationFrame: number;

    const updateProgress = () => {
      if (isPressed && pressStartTime) {
        const currentDuration = Date.now() - pressStartTime;
        const progress = Math.min((currentDuration / DASH_LENGTH) * 100, 100);
        setPressProgress(progress);
        animationFrame = requestAnimationFrame(updateProgress);
      }
    };

    if (isPressed) {
      animationFrame = requestAnimationFrame(updateProgress);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPressed, pressStartTime, DASH_LENGTH]);

  // Handle gap timing between presses using a polling interval so we reliably
  // detect when gaps cross thresholds (letter/word/clear).
  useEffect(() => {
    const interval = setInterval(() => {
      // If user is pressing again, skip checking
      if (isPressed) return;

      const gapDuration = Date.now() - (lastReleaseTime || 0);

      if (gapDuration >= CLEAR_GAP && displayText.length > 0) {
        // Before clearing, notify parent with current displayText
        if (onSubmit) onSubmit(displayText);
        // Clear everything
        setDisplayText("");
        setCurrentMorse("");
        setLastReleaseTime(null);
        return;
      }

      if (gapDuration >= LETTER_GAP) {
        // Finalize current morse as a character (no space)
        if (currentMorse) {
          const character = morseToCharMap[currentMorse];
          if (character) {
            setDisplayText((prev) => prev + character);
          } else {
            // Unrecognized sequence -> clear display
            setDisplayText("");
          }
          setCurrentMorse("");
        }
        setLastReleaseTime(null);
        return;
      }
      // otherwise continue polling
    }, 1000);

    return () => clearInterval(interval);
  }, [
    lastReleaseTime,
    isPressed,
    onSubmit,
    currentMorse,
    displayText,
    LETTER_GAP,
    CLEAR_GAP,
  ]);

  const handleClear = () => {
    setDisplayText("");
    setCurrentMorse("");
    setLastReleaseTime(null);
  };

  const thresholdPercentage = (DOT_LENGTH / DASH_LENGTH) * 100; // where dot becomes dash

  return (
    <div className="flex flex-col gap-6 items-center min-w-80 p-8 bg-white rounded-lg border-2 border-orange-600 max-w-2xl">
      {/* Display Area with Progress Bar */}
      <div className="flex items-end gap-4 w-full">
        {/* Morse Display */}
        <div className="flex-1 bg-gray-100 border-2 border-gray-300 rounded p-6 min-h-32 flex flex-col items-center justify-center gap-4">
          <div className="text-xl font-press-start-2p text-orange-900 tracking-widest">
            {displayText}
          </div>
          {currentMorse && (
            <div className="text-lg font-press-start-2p text-blue-600 tracking-widest">
              {currentMorse}
            </div>
          )}
        </div>

        {/* Progress Bar Container */}
        {showBar && (
          <div className="flex flex-col items-center gap-2">
            <div className="relative h-22 w-6 bg-gray-200 border-2 border-gray-400 rounded overflow-hidden">
              {/* Threshold Line (Red) - where dot becomes dash */}
              <div
                className="absolute left-0 right-0 h-1 bg-red-500 z-10"
                style={{ bottom: `${thresholdPercentage}%` }}
              />

              {/* Progress Bar - capped at 100% */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-blue-500 transition-all"
                style={{
                  height: `${pressProgress * 10}%`,
                }}
              />
            </div>

            {/* Toggle Bar Button */}
            <button
              onClick={() => setShowBar(!showBar)}
              className="p-1 bg-gray-300 hover:bg-gray-400 rounded border border-gray-500 transition-all"
              title="Toggle progress bar visibility"
            >
              <EyeIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Toggle Bar Button (when hidden) */}
        {!showBar && (
          <button
            onClick={() => setShowBar(!showBar)}
            className="p-1 bg-gray-300 hover:bg-gray-400 rounded border border-gray-500 transition-all"
            title="Toggle progress bar visibility"
          >
            <EyeSlashIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-press-start-2p text-xs rounded border-2 border-red-600 transition-all"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default TransmitPlayground;
