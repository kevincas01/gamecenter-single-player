import { useContext } from "react";
import { BoardContext } from "../../Wordle";

const KeyboardButton = ({ value }) => {
  const { letterSetUsed, handleLetterSelect } =useContext(BoardContext);

  let state = "";
  if (value in letterSetUsed) {
    state = letterSetUsed[value];
  }
  return (
    <div
      className={`keyboard-letter ${state}`}
      onClick={() => handleLetterSelect(value)}
    >
      {value}
    </div>
  );
};
export default KeyboardButton;
