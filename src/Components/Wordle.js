import React from "react";

import "../Styles/wordle.css";

import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  checkCorrect,
  checkWrongPlacement,
  countLetterOccurrences,
  generateWordSet,
} from "../lib/wordleUtils";
import GameWonModal from "./Modals/GameWonModal";
import GameLostModal from "./Modals/GameLostModal";

import KeyboardGrid from "./Wordle/Keyboard/KeyboardGrid";
import GameGrid from "./Wordle/GameGrid";

export const BoardContext = React.createContext();

const Wordle = () => {
  const [gameStart, setGameStart] = React.useState(false);

  const [numGamesWon, setNumGamesWon] = React.useState(0);
  const [currStreak, setCurrStreak] = React.useState(0);

  const [gameWon, setGameWon] = React.useState(false);
  const [gameOver, setGameOver] = React.useState(false);

  const [gameOverModal, setGameOverModal] = React.useState(false);

  const [boardState, setBoardState] = React.useState([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ]);

  const[boardGuessesState, setBoardGuessesState] = React.useState([]);

  const [attemptNumber, setAttemptNumber] = React.useState(0);
  const [positionNumber, setPositionNumber] = React.useState(0);

  const [letterSetUsed, setLetterSetUsed] = React.useState({});

  const [wordSet, setWordSet] = React.useState(new Set());
  const [wordArray, setWordArray] = React.useState([]);
  const [correctWord, setCorrectWord] = React.useState("");
  const [correctWordLetterCount, setCorrectWordLetterCount] = React.useState(
    {}
  );

  React.useEffect(() => {
    generateWordSet().then((words) => {
      setWordSet(words.wordSet);
      setWordArray(words.wordArr);

      // const length=words.wordArr.length
      // socket.emit("start_wordle_game",{room,length})
    });
  }, []);

  const startWordleGame = () => {
    setGameStart(true);

    const index = Math.floor(Math.random() * wordArray.length);

    const word = wordArray[index];
    setCorrectWord(word);
    const letterCounts = countLetterOccurrences(word);

    setCorrectWordLetterCount(letterCounts);
  };

  const handleLetterSelect = (keyVal) => {
    if (positionNumber === 5 || attemptNumber > 5 || gameOver) return;
    setBoardState((prevBoardState) => {
      const newBoard = [...prevBoardState];
      newBoard[attemptNumber][positionNumber] = keyVal;
      return newBoard;
    });
    setPositionNumber((prevNumber) => prevNumber + 1);
  };

  const handleLetterDelete = () => {
    if (positionNumber <= 0 || attemptNumber > 5) return;

    setBoardState((prevBoardState) => {
      const newBoard = [...prevBoardState];
      newBoard[attemptNumber][positionNumber - 1] = "";
      return newBoard;
    });
    setPositionNumber((prevNumber) => prevNumber - 1);
  };
  const handleReset = () => {
    const index = Math.floor(Math.random() * wordArray.length);
    const word = wordArray[index];
    setCorrectWord(word);
    const letterCounts = countLetterOccurrences(word);

    setCorrectWordLetterCount(letterCounts);

    setBoardState([
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ]);
    setBoardGuessesState([])
    setGameWon(false);
    setGameOver(false);
    setGameOverModal(false);

    setAttemptNumber(0);
    setPositionNumber(0);
    setLetterSetUsed({});
  };

  const handleWordEnter = () => {
    if (attemptNumber > 5) return;
    if (positionNumber < 5) {
      toast("Not enough letters", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        closeButton: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        transition: Zoom,
      });
      return;
    }

    const word = boardState[attemptNumber];
    if (!wordSet.has(word.join("").toLowerCase())) {
      toast("Word not in word bank!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        closeButton: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        transition: Zoom,
      });
      return;
    }

    let newSet = { ...letterSetUsed };
    let correct;
    let wrongPlace;

    let currentGuessState=[]
    for (let i = 0; i < word.length; i++) {
      let state = "";
      
      correct = word[i].toUpperCase() === correctWord[i].toUpperCase();

      wrongPlace = checkWrongPlacement(
        correctWordLetterCount,
        word,
        word[i],
        i,
        correctWord
      );

      state = correct ? "correct" : wrongPlace ? "wrong-place" : "wrong";
      currentGuessState.push(state)

      if (word[i] in newSet) {
        if (newSet[word[i]] === "wrong-place") {
          state =
            word[i].toUpperCase() === correctWord[i].toUpperCase()
              ? "correct"
              : "wrong-place";
          newSet[word[i]] = state;
        }
        continue;
      }
      newSet[word[i]] = state; // Update the state for the current letter
    }
    setBoardGuessesState(prevBoardGuessesState=>{
      const newBoardGuessesState=[...prevBoardGuessesState,currentGuessState]
      return newBoardGuessesState
    })

    setLetterSetUsed(newSet);

    setPositionNumber(0);
    setAttemptNumber((prevNumber) => prevNumber + 1);
    const gameWon = checkCorrect(correctWord, word);
    if (gameWon) {
      setGameOver(true);
      setGameWon(true);

      toast("Correct", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        closeButton: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        transition: Zoom,
      });
    } else if (attemptNumber >= 5 && !gameWon) {
      toast(correctWord, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        closeButton: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
        transition: Zoom,
      });
      setGameOver(true);
    }
  };
  const closeModal = () => {
    setGameOverModal(false);
  };

  return (
    <div className="wordle-container">
      <h1>Wordle</h1>

      {!gameStart ? (
        <div className="game_start_container">
          {/* https://www.nytimes.com/2023/08/01/crosswords/how-to-talk-about-wordle.html */}
          <h2>How to play Wordle</h2>

          <div>
            <h3>Guess the word in 6 tries.</h3>
            <ul>
              <li>Each guess must be a valid five-letter word.</li>
              <li>
                The color of a tile will change to show you how close your guess
                was.
              </li>
            </ul>
          </div>
          <p>
            If the tile turns green, the letter is in the word, and it is in the
            correct spot.
          </p>
          <p>
            If the tile turns yellow, the letter is in the word, but it is not
            in the correct spot.
          </p>
          <p>If the tile turns gray, the letter is not in the word.</p>
          <button onClick={startWordleGame}>Start Wordle Game!</button>
        </div>
      ) : (
        <BoardContext.Provider
          value={{
            boardState,
            setBoardState,
            boardGuessesState,
            correctWord,
            correctWordLetterCount,
            attemptNumber,
            setAttemptNumber,
            positionNumber,
            setPositionNumber,
            handleLetterSelect,
            handleLetterDelete,
            handleWordEnter,
            letterSetUsed,
          }}
        >
          {gameOver && gameWon ? (
            <GameWonModal
              open={gameOverModal}
              closeModal={closeModal}
              reset={handleReset}
            />
          ) : gameOver && !gameWon ? (
            <GameLostModal
              open={gameOverModal}
              closeModal={closeModal}
              correctWord={correctWord}
              reset={handleReset}
              guesses={boardGuessesState}
              gameType={"wordle"}
            />
          ) : (
            <></>
          )}

          {gameOver && (
            <button
              className="view-results"
              onClick={() => {
                setGameOverModal(true);
              }}
            >
              View resultss
            </button>
          )}
          <GameGrid />

          <KeyboardGrid />
        </BoardContext.Provider>
      )}

      <ToastContainer />
    </div>
  );
};
export default Wordle;
