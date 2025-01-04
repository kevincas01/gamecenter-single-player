import { useContext, useEffect, useState, useMemo } from "react";
import { checkWrongPlacement } from "../../../lib/wordleUtils";
import { BoardContext } from "../../Wordle";

const LetterCard = ({ attemptNum, letterPosition }) => {
  const {
    boardState,
    correctWord,
    correctWordLetterCount,
    attemptNumber,
  } = useContext(BoardContext);

  const [keyState, setKeyState] = useState("");

  const letter = boardState[attemptNum][letterPosition];

  // Use memoization to avoid recomputing state for non-active attempts
  const calculatedState = useMemo(() => {
    if (!letter || attemptNum >= attemptNumber) {
      return ""; // Remain constant for non-current attempts
    }

    const correct = letter.toUpperCase() === correctWord[letterPosition].toUpperCase();
    const wrongPlace = checkWrongPlacement(
      correctWordLetterCount,
      boardState[attemptNum],
      letter,
      letterPosition
    );

    return correct ? "correct" : wrongPlace ? "wrong-place" : "wrong";
  }, [letter, attemptNum, attemptNumber, correctWord, correctWordLetterCount, boardState[attemptNum]]);

  // Only update `keyState` when the calculated state changes
  useEffect(() => {
    if (keyState !== calculatedState) {
      setKeyState(calculatedState);
    }
  }, [calculatedState, keyState]);

  return <div className={`letter-card ${keyState}`}>{letter}</div>;
};

export default LetterCard;
