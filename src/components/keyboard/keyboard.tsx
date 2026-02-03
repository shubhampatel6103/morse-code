"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface KeyboardProps {
  onSubmit?: (selectedKeys: string[]) => void;
  showSubmit?: boolean;
}

const Keyboard = ({ onSubmit, showSubmit = true }: KeyboardProps) => {
  const router = useRouter();
  const numberRow = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  const topRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const middleRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const bottomRow = ["Z", "X", "C", "V", "B", "N", "M"];
  const allKeys = [...numberRow, ...topRow, ...middleRow, ...bottomRow];
  const allLetters = [...topRow, ...middleRow, ...bottomRow];

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const toggleKey = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const selectAll = () => {
    if (selectedKeys.length === allKeys.length) {
      setSelectedKeys([]);
    } else {
      setSelectedKeys(allKeys);
    }
  };

  const selectAllNumbers = () => {
    const allNumbersSelected = numberRow.every((num) =>
      selectedKeys.includes(num),
    );

    if (allNumbersSelected) {
      setSelectedKeys((prev) => prev.filter((k) => !numberRow.includes(k)));
    } else {
      setSelectedKeys((prev) => {
        const updated = new Set([...prev, ...numberRow]);
        return Array.from(updated);
      });
    }
  };

  const selectAllLetters = () => {
    const allLettersSelected = allLetters.every((letter) =>
      selectedKeys.includes(letter),
    );

    if (allLettersSelected) {
      setSelectedKeys((prev) => prev.filter((k) => !allLetters.includes(k)));
    } else {
      setSelectedKeys((prev) => {
        const updated = new Set([...prev, ...allLetters]);
        return Array.from(updated);
      });
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(selectedKeys);
    } else {
      router.push(`/tutorial?keys=${selectedKeys.join(",")}`);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();

      // Check if the key is one of our keyboard keys
      if (allKeys.includes(key)) {
        event.preventDefault();
        toggleKey(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allKeys]);

  const KeyButton = ({ keyChar }: { keyChar: string }) => (
    <button
      onClick={() => toggleKey(keyChar)}
      className={`h-12 w-12 border-2 rounded cursor-pointer transition-all font-press-start-2p text-sm flex items-center justify-center ${
        selectedKeys.includes(keyChar)
          ? "bg-orange-900 border-orange-700"
          : "bg-orange-500 hover:bg-orange-600 border-orange-600"
      }`}
    >
      {keyChar}
    </button>
  );

  return (
    <div className="flex flex-col gap-6 p-8 max-w-3xl mx-auto">
      {/* Selection Control Buttons */}
      {showSubmit && (
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={selectAll}
            className={`px-4 py-2 font-press-start-2p text-xs rounded border-2 transition-all ${
              selectedKeys.length === allKeys.length
                ? "bg-orange-900 border-orange-700 text-white hover:bg-orange-800"
                : "bg-orange-500 hover:bg-orange-600 border-orange-600 text-white"
            }`}
          >
            {selectedKeys.length === allKeys.length
              ? "Deselect All"
              : "Select All"}
          </button>
          <button
            onClick={selectAllNumbers}
            className={`px-4 py-2 font-press-start-2p text-xs rounded border-2 transition-all ${
              numberRow.every((num) => selectedKeys.includes(num))
                ? "bg-orange-900 border-orange-700 text-white hover:bg-orange-800"
                : "bg-orange-500 hover:bg-orange-600 border-orange-600 text-white"
            }`}
          >
            {numberRow.every((num) => selectedKeys.includes(num))
              ? "Deselect Numbers"
              : "Select Numbers"}
          </button>
          <button
            onClick={selectAllLetters}
            className={`px-4 py-2 font-press-start-2p text-xs rounded border-2 transition-all ${
              allLetters.every((letter) => selectedKeys.includes(letter))
                ? "bg-orange-900 border-orange-700 text-white hover:bg-orange-800"
                : "bg-orange-500 hover:bg-orange-600 border-orange-600 text-white"
            }`}
          >
            {allLetters.every((letter) => selectedKeys.includes(letter))
              ? "Deselect Letters"
              : "Select Letters"}
          </button>
        </div>
      )}

      {/* Number Row */}
      <div className="flex gap-2 justify-center">
        {numberRow.map((key) => (
          <KeyButton key={key} keyChar={key} />
        ))}
      </div>

      {/* Top Row (QWERTY) */}
      <div className="flex gap-2 justify-center">
        {topRow.map((key) => (
          <KeyButton key={key} keyChar={key} />
        ))}
      </div>

      {/* Middle Row (ASDF) */}
      <div className="flex gap-2 justify-center pl-6">
        {middleRow.map((key) => (
          <KeyButton key={key} keyChar={key} />
        ))}
      </div>

      {/* Bottom Row (ZXC) */}
      <div className="flex gap-2 justify-center pl-12">
        {bottomRow.map((key) => (
          <KeyButton key={key} keyChar={key} />
        ))}
      </div>

      {/* Submit Button */}
      {showSubmit && (
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={selectedKeys.length === 0}
            className={`px-6 py-3 font-press-start-2p text-sm rounded border-2 transition-all ${
              selectedKeys.length === 0
                ? "bg-gray-400 border-gray-500 text-gray-600 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 border-orange-600 text-white cursor-pointer"
            }`}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default Keyboard;
