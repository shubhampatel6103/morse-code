"use client";

import { useEffect, useEffectEvent, useState } from "react";
import Title from "@/components/title";
import Button from "@/components/button";
import TransmitPlayground from "@/components/transmitPlayground/transmitPlayground";
import { getRandomWord } from "@/lib/getRandomWord";
import { HomeIcon } from "@heroicons/react/24/solid";

export default function TransmitExercise() {
  const [target, setTarget] = useState("");
  const [feedback, setFeedback] = useState<"" | "correct" | "incorrect">("");

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

  const handleSubmit = (decodedText: string) => {
    const normalize = (s: string) => s.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    if (normalize(decodedText) === normalize(target)) {
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
  };

  // When the user is correct, automatically advance to a new word after a short delay
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
      <Title text="Transmit" />

      <div className="absolute top-4 left-4">
        <Button href="/" icon={<HomeIcon className="w-5 h-5 text-white" />} />
      </div>

      <div className="text-center mb-6">
        <p className="text-2xl font-press-start-2p text-orange-900">{target}</p>
        {feedback === "correct" && (
          <div className="text-green-700 mt-2 font-press-start-2p">Correct</div>
        )}
      </div>

      <div className="w-full max-w-2xl">
        <TransmitPlayground onSubmit={handleSubmit} />
      </div>

      <div className="mt-6">
        <Button text="New Word" onClick={newWord} />
      </div>
    </main>
  );
}
