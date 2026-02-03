"use client";

import { useState, useEffect } from "react";
import Title from "@/components/title";
import Button from "@/components/button";
import { commonWords } from "@/lib/words";

export default function Receive() {
  const [word, setWord] = useState("");

  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * commonWords.length);
    setWord(commonWords[randomIndex]);
  };

  useEffect(() => {
    getRandomWord();
  }, []);

  return (
    <main className="bg-orange-200 min-h-screen flex flex-col items-center justify-center p-8">
      <Title text="Receive" />
      <div className="text-center mb-8">
        <p className="text-2xl font-press-start-2p">{word}</p>
      </div>
      <Button text="New Word" onClick={getRandomWord} />
    </main>
  );
}
