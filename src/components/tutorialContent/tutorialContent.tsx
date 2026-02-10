"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Button from "@/components/button";
import TransmitPlayground from "@/components/transmitPlayground/transmitPlayground";
import { morseCodeMap } from "@/lib/morseCode";

const TutorialContent = () => {
  const searchParams = useSearchParams();
  const keysParam = searchParams.get("keys");
  const selectedKeys = keysParam ? keysParam.split(",") : [];

  const [hintMode, setHintMode] = useState(false);
  const [targetKey, setTargetKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  const [stage, setStage] = useState<
    | "single1"
    | "single2"
    | "pairs"
    | "triples"
    | "randomPairs"
    | "randomTriples"
  >("single1");
  const [queue, setQueue] = useState<string[]>([]);

  // helpers
  const shuffleArray = (arr: string[]) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const buildAllSequences = (chars: string[], length: number) => {
    if (length === 1) return chars.slice();
    const results: string[] = [];
    const recurse = (prefix: string, depth: number) => {
      if (depth === 0) {
        results.push(prefix);
        return;
      }
      for (const c of chars) recurse(prefix + c, depth - 1);
    };
    recurse("", length);
    return results;
  };

  useEffect(() => {
    if (!keysParam) return;
    const chars = selectedKeys.map((c) => c.toUpperCase());
    if (chars.length === 0) return;
    // start with first single pass
    setQueue(shuffleArray(chars));
    setStage("single1");
    setTargetKey(null);
    setFeedback("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keysParam]);

  useEffect(() => {
    // if target empty and queue has items, pop next
    if (!targetKey && queue.length > 0) {
      setQueue((prev) => {
        const [next, ...rest] = prev;
        setTargetKey(next);
        return rest;
      });
    }
  }, [queue, targetKey]);

  const pickRandomSequence = (length: number) => {
    const chars = selectedKeys.map((c) => c.toUpperCase());
    if (chars.length === 0) return null;
    let s = "";
    for (let i = 0; i < length; i++)
      s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  };

  const startPairsStage = () => {
    const chars = selectedKeys.map((c) => c.toUpperCase());
    if (chars.length <= 10) {
      setQueue(shuffleArray(buildAllSequences(chars, 2)));
      setStage("pairs");
      setTargetKey(null);
    } else {
      setStage("randomPairs");
      setTargetKey(pickRandomSequence(2));
    }
  };

  const startTriplesStage = () => {
    const chars = selectedKeys.map((c) => c.toUpperCase());
    if (chars.length <= 5) {
      setQueue(shuffleArray(buildAllSequences(chars, 3)));
      setStage("triples");
      setTargetKey(null);
    } else {
      setStage("randomTriples");
      setTargetKey(pickRandomSequence(3));
    }
  };

  const handleTransmitSubmit = (text: string) => {
    const submitted = text.trim().toUpperCase();
    if (!targetKey) return;
    if (submitted === targetKey) {
      // correct
      setFeedback("Correct");
      setTimeout(() => setFeedback(""), 400);

      if (stage === "single1") {
        if (queue.length === 0) {
          // start second single pass
          setQueue(shuffleArray(selectedKeys.map((c) => c.toUpperCase())));
          setStage("single2");
          setTargetKey(null);
        } else {
          setTargetKey(null);
        }
      } else if (stage === "single2") {
        if (queue.length === 0) {
          // decide next
          if (selectedKeys.length <= 10) startPairsStage();
          else setStage("randomPairs");
        } else setTargetKey(null);
      } else if (stage === "pairs") {
        if (queue.length === 0) {
          // move to triples if small set
          if (selectedKeys.length <= 5) startTriplesStage();
          else setStage("randomPairs");
        } else setTargetKey(null);
      } else if (stage === "triples") {
        if (queue.length === 0) {
          // finished; restart single pass
          setQueue(shuffleArray(selectedKeys.map((c) => c.toUpperCase())));
          setStage("single1");
          setTargetKey(null);
        } else setTargetKey(null);
      } else if (stage === "randomPairs") {
        setTargetKey(pickRandomSequence(2));
      } else if (stage === "randomTriples") {
        setTargetKey(pickRandomSequence(3));
      }
    } else {
      // incorrect: do not show feedback per requirement
      setFeedback("");
    }
  };

  if (selectedKeys.length === 0) {
    return (
      <div className="text-center">
        <p className="text-2xl font-press-start-2p mb-4">No keys selected</p>
        <Button text="Go Back" onClick={() => window.history.back()} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 mt-8">
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-700 font-press-start-2p">Mode:</div>
        <button
          onClick={() => setHintMode(true)}
          className={`px-3 py-1 rounded border ${hintMode ? "bg-orange-500 text-white" : "bg-white text-black"}`}
        >
          Hint
        </button>
        <button
          onClick={() => setHintMode(false)}
          className={`px-3 py-1 rounded border ${!hintMode ? "bg-orange-500 text-white" : "bg-white text-black"}`}
        >
          No Hint
        </button>
      </div>

      <div className="text-center">
        <div className="text-sm text-gray-700 font-press-start-2p">
          Transmit the following:
        </div>
      </div>

      <div className="text-center">
        <div className="text-3xl sm:text-4xl font-bold font-press-start-2p text-orange-900 mb-2 wrap-break-word">
          {targetKey}
        </div>
        {hintMode && targetKey && (
          <div className="text-sm sm:text-base text-gray-600 font-press-start-2p">
            {targetKey.length === 1
              ? morseCodeMap[targetKey]
              : targetKey
                  .split("")
                  .map((ch) => morseCodeMap[ch] ?? "")
                  .join("\t")}
          </div>
        )}
      </div>

      <div className="w-full max-w-2xl">
        <TransmitPlayground onSubmit={handleTransmitSubmit} />
      </div>

      <div className="text-center">
        <div className="text-sm font-press-start-2p text-green-700">
          {feedback}
        </div>
      </div>

      <div className="w-full max-w-2xl flex justify-between">
        <Button text="Back" onClick={() => window.history.back()} />
      </div>
    </div>
  );
};

export default TutorialContent;
