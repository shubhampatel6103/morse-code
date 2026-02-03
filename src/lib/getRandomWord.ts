import randomWords from "random-words";

export function getRandomWord() {
  // random-words returns lowercase words by default
  return randomWords(1)[0];
}

export default getRandomWord;
