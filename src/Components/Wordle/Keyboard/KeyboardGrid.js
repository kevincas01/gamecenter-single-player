import { useCallback, useContext, useEffect } from "react";
import KeyboardButton from "./KeyboardButton";
import { BoardContext } from "../../Wordle";

const KeyboardGrid = () => {
  const keyboardLetters1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const keyboardLetters2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const keyboardLetters3 = ["Z", "X", "C", "V", "B", "N", "M"];

  const { handleLetterSelect, handleLetterDelete, handleWordEnter } =
   useContext(BoardContext);

  const handleKeyboardPress = useCallback((e) => {
    if (e.key === "Enter") {
      handleWordEnter();
    } else if (e.key === "Backspace") {
      handleLetterDelete();
    } else {
      keyboardLetters1.forEach((keyLetter) => {
        if (keyLetter.toUpperCase() === e.key.toUpperCase()) {
          handleLetterSelect(keyLetter);
          return;
        }
      });
      keyboardLetters2.forEach((keyLetter) => {
        if (keyLetter.toUpperCase() === e.key.toUpperCase()) {
          handleLetterSelect(keyLetter);
          return;
        }
      });
      keyboardLetters3.forEach((keyLetter) => {
        if (keyLetter.toUpperCase() === e.key.toUpperCase()) {
          handleLetterSelect(keyLetter);
          return;
        }
      });
    }
  });
  useEffect(() => {
    document.addEventListener("keydown", handleKeyboardPress);
    return () => {
      document.removeEventListener("keydown", handleKeyboardPress);
    };
  }, [handleKeyboardPress]);

  return (
    <div className="keyboard-grid">
      <div className="keyboard-letters" onKeyDown={handleKeyboardPress}>
        {keyboardLetters1.map((keyLetter, index) => (
          <KeyboardButton
            key={index}
            value={keyLetter}
            handleClick={handleLetterSelect}
          />
        ))}
      </div>
      <div className="keyboard-letters">
        {keyboardLetters2.map((keyLetter, index) => (
          <KeyboardButton
            key={index}
            value={keyLetter}
            handleClick={handleLetterSelect}
          />
        ))}
      </div>
      <div className="keyboard-letters">
        <div className="keyboard-letter special" onClick={handleWordEnter}>
          Enter
        </div>
        {keyboardLetters3.map((keyLetter, index) => (
          <KeyboardButton
            key={index}
            value={keyLetter}
            handleClick={handleLetterSelect}
          />
        ))}
        <div className="keyboard-letter special" onClick={handleLetterDelete}>
          Delete
        </div>
      </div>
    </div>
  );
};

export default KeyboardGrid