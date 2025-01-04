import wordBank from "../Data/wordle-bank.txt";

export const checkWrongPlacement = (
  letterCounts,
  currentWord,
  letter,
  position,
  correctWord
) => {
  let letterCount = letterCounts[letter.toUpperCase()] || 0; // Get the letter count from correctWord
  if(!letterCount)return false
  for (let i = 0; i < correctWord.length; i++) {
    if (correctWord[i]?.toUpperCase() === currentWord[i].toUpperCase() && correctWord[i]?.toUpperCase() ===letter.toUpperCase()) {
      letterCount -= 1;
    }
  }


  for (let i = 0; i < position; i++) {
    if (currentWord[i]?.toUpperCase()===letter.toUpperCase() && correctWord[i].toUpperCase()!=currentWord[i]?.toUpperCase()) {
      letterCount -= 1;
    }
  }
  const isInWrongPlace = letterCount > 0;

  return isInWrongPlace;
};

export const checkCorrect = (correctWord, word) => {
  const wordString = word.join(""); // Convert array of strings into a single string

  return wordString.toUpperCase() === correctWord.toUpperCase();
};

export const generateWordSet = async () => {
  let wordSet;
  let currWord;
  let wordArr;
  await fetch(wordBank)
    .then((response) => response.text())
    .then((result) => {
      wordArr = result.split("\n");
      currWord = wordArr[Math.floor(Math.random() * wordArr.length)];
      wordSet = new Set(wordArr);
    });
  return { wordArr, wordSet, currWord };
};

export const countLetterOccurrences = (word) => {
  const letterCounts = {};
  for (const letter of word) {
    const upperLetter = letter.toUpperCase();
    letterCounts[upperLetter] = (letterCounts[upperLetter] || 0) + 1;
  }
  return letterCounts;
};
