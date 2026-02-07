"use client";

import { useEffect, useEffectEvent, useState } from "react";
import Title from "@/components/title";
import Button from "@/components/button";
import ReceivePlayground from "@/components/receivePlayground/receivePlayground";
import { getRandomWord } from "@/lib/getRandomWord";
import { HomeIcon } from "@heroicons/react/24/solid";

export default function ReceiveExercise() {
  const [target, setTarget] = useState("");
  const [feedback, setFeedback] = useState<"" | "correct" | "incorrect">("");
  const [speed, setSpeed] = useState<"fast" | "slow">("fast");

  const newWord = () => {
    setFeedback("");
    const w = getRandomWord();
    setTarget(w);
  };

  const onMount = useEffectEvent(() => {
    newWord();
  });

  useEffect(() => {
    onMount();
  }, []);

  const checkGuess = (text: string) => {
    const normalize = (s: string) => s.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    if (normalize(text) === normalize(target)) {
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
  };

  // Auto-advance to a new word shortly after a correct guess
  useEffect(() => {
    if (feedback === "correct") {
      const t = window.setTimeout(() => {
        newWord();
      }, 800);
      return () => window.clearTimeout(t);
    }
    return;
  }, [feedback]);

  return (
    <main className="bg-orange-200 min-h-screen flex flex-col items-center justify-center p-8">
      <Title text="Receive" />

      <div className="absolute top-4 left-4">
        <Button href="/" icon={<HomeIcon className="w-5 h-5 text-white" />} />
      </div>

      <div className="mb-6 w-full max-w-2xl">
        <div className="mb-4 flex justify-center gap-4">
          <button
            onClick={() => setSpeed("fast")}
            className={`flex items-center gap-2 bg-orange-700 hover:bg-orange-900 text-white font-bold py-2 px-4 rounded font-press-start-2p text-sm ${
              speed === "fast" ? "opacity-100" : "opacity-50"
            }`}
          >
            Fast
          </button>
          <button
            onClick={() => setSpeed("slow")}
            className={`flex items-center gap-2 bg-orange-700 hover:bg-orange-900 text-white font-bold py-2 px-4 rounded font-press-start-2p text-sm ${
              speed === "slow" ? "opacity-100" : "opacity-50"
            }`}
          >
            Slow
          </button>
        </div>

        <ReceivePlayground
          target={target}
          dotLength={speed === "fast" ? 100 : 200}
          onSubmit={checkGuess}
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div>
          {feedback === "correct" && (
            <div className="text-green-700 mt-2 font-press-start-2p">
              Correct
            </div>
          )}
          {feedback === "incorrect" && (
            <div className="text-red-700 mt-2 font-press-start-2p">
              Incorrect
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <Button text="New Word" onClick={newWord} />
        </div>
      </div>
    </main>
  );
}
