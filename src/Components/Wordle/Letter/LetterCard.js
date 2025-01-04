import { useContext, useEffect, useState, useMemo } from "react";
import { checkWrongPlacement } from "../../../lib/wordleUtils";
import { BoardContext } from "../../Wordle";

const LetterCard = ({ attemptNum, letterPosition }) => {
  const { boardState, boardGuessesState, correctWord, correctWordLetterCount, attemptNumber } =
    useContext(BoardContext);

  const letter = boardState[attemptNum][letterPosition];
  let keyState=""
  console.log(boardGuessesState)
  if(boardGuessesState.length-1<attemptNum){
    return <div className={`letter-card`}>{letter}</div>;
  }
  else{
    keyState=boardGuessesState[attemptNum][letterPosition]
  }
  // const keyState= boardGuessesState[attemptNum][letterPosition] | " "

  return <div className={`letter-card ${keyState}`}>{letter}</div>;
};

export default LetterCard;
