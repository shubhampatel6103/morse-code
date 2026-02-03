"use client";

import { useState, useEffect } from "react";
import Title from "@/components/title";
import Button from "@/components/button";
import randomWords from "random-words";
import { HomeIcon } from "@heroicons/react/24/solid";

export default function Transmit() {
  const [word, setWord] = useState("");

  const getRandomWord = () => {
    setWord(randomWords(1)[0]);
  };

  useEffect(() => {
    getRandomWord();
  }, []);

  return (
    <main className="bg-orange-200 min-h-screen flex flex-col items-center justify-center p-8">
      <Title text="Transmit" />
      <div className="absolute top-4 left-4">
        <Button href="/" icon={<HomeIcon className="w-5 h-5 text-white" />} />
      </div>
      <div className="text-center mb-8">
        <p className="text-2xl font-press-start-2p text-orange-900">{word}</p>
      </div>
      <Button text="New Word" onClick={getRandomWord} />
    </main>
  );
}
