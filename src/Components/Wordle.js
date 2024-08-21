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

import { defaultBoard } from "../Data/wordleData";

const BoardContext = React.createContext();

const KeyboardButton = ({ value }) => {
  const { letterSetUsed, handleLetterSelect } = React.useContext(BoardContext);

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

const KeyboardGrid = () => {
  const keyboardLetters1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const keyboardLetters2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const keyboardLetters3 = ["Z", "X", "C", "V", "B", "N", "M"];

  const { handleLetterSelect, handleLetterDelete, handleWordEnter } =
    React.useContext(BoardContext);

  const handleKeyboardPress = React.useCallback((e) => {
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
  React.useEffect(() => {
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

const LetterCard = ({ attemptNum, letterPosition }) => {
  const {
    boardState,
    correctWord,
    correctWordLetterCount,
    letterSetUsed,
    attemptNumber,
  } = React.useContext(BoardContext);

  const [keyState, setKeyState] = React.useState("");

  const letter = boardState[attemptNum][letterPosition];

  React.useEffect(() => {
    if (keyState) {
      setKeyState("");
    }
  }, [correctWord]);

  React.useEffect(() => {
    if (!keyState && letter && attemptNum < attemptNumber) {
      const correct =
        letter.toUpperCase() === correctWord[letterPosition].toUpperCase();
      const wrongPlace = checkWrongPlacement(
        correctWordLetterCount,
        boardState[attemptNum],
        letter,
        letterPosition
      );
      const newState = correct
        ? "correct"
        : wrongPlace
        ? "wrong-place"
        : "wrong";
      setKeyState(newState);
    }
  }, [letterPosition, boardState, correctWord, attemptNumber]);

  return <div className={`letter-card ${keyState}`}>{letter}</div>;
};
const GameGrid = () => {
  return (
    <div className="wordle-grid">
      <div className="row">
        <LetterCard attemptNum={0} letterPosition={0}></LetterCard>
        <LetterCard attemptNum={0} letterPosition={1}></LetterCard>
        <LetterCard attemptNum={0} letterPosition={2}></LetterCard>
        <LetterCard attemptNum={0} letterPosition={3}></LetterCard>
        <LetterCard attemptNum={0} letterPosition={4}></LetterCard>
      </div>
      <div className="row">
        <LetterCard attemptNum={1} letterPosition={0}></LetterCard>
        <LetterCard attemptNum={1} letterPosition={1}></LetterCard>
        <LetterCard attemptNum={1} letterPosition={2}></LetterCard>
        <LetterCard attemptNum={1} letterPosition={3}></LetterCard>
        <LetterCard attemptNum={1} letterPosition={4}></LetterCard>
      </div>
      <div className="row">
        <LetterCard attemptNum={2} letterPosition={0}></LetterCard>
        <LetterCard attemptNum={2} letterPosition={1}></LetterCard>
        <LetterCard attemptNum={2} letterPosition={2}></LetterCard>
        <LetterCard attemptNum={2} letterPosition={3}></LetterCard>
        <LetterCard attemptNum={2} letterPosition={4}></LetterCard>
      </div>
      <div className="row">
        <LetterCard attemptNum={3} letterPosition={0}></LetterCard>
        <LetterCard attemptNum={3} letterPosition={1}></LetterCard>
        <LetterCard attemptNum={3} letterPosition={2}></LetterCard>
        <LetterCard attemptNum={3} letterPosition={3}></LetterCard>
        <LetterCard attemptNum={3} letterPosition={4}></LetterCard>
      </div>
      <div className="row">
        <LetterCard attemptNum={4} letterPosition={0}></LetterCard>
        <LetterCard attemptNum={4} letterPosition={1}></LetterCard>
        <LetterCard attemptNum={4} letterPosition={2}></LetterCard>
        <LetterCard attemptNum={4} letterPosition={3}></LetterCard>
        <LetterCard attemptNum={4} letterPosition={4}></LetterCard>
      </div>
      <div className="row">
        <LetterCard attemptNum={5} letterPosition={0}></LetterCard>
        <LetterCard attemptNum={5} letterPosition={1}></LetterCard>
        <LetterCard attemptNum={5} letterPosition={2}></LetterCard>
        <LetterCard attemptNum={5} letterPosition={3}></LetterCard>
        <LetterCard attemptNum={5} letterPosition={4}></LetterCard>
      </div>
    </div>
  );
};

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
    if (positionNumber === 5 || attemptNumber > 5) return;
    const newBoard = [...boardState];
    newBoard[attemptNumber][positionNumber] = keyVal;
    setBoardState(newBoard);
    setPositionNumber((prevNumber) => prevNumber + 1);
  };

  const handleLetterDelete = () => {
    if (positionNumber <= 0 || attemptNumber > 5) return;

    const newBoard = [...boardState];
    newBoard[attemptNumber][positionNumber - 1] = "";
    setBoardState(newBoard);
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

    for (let i = 0; i < word.length; i++) {
      let state = "";
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
      correct = word[i].toUpperCase() === correctWord[i].toUpperCase();

      wrongPlace = checkWrongPlacement(
        correctWordLetterCount,
        word,
        word[i],
        i
      );

      state = correct ? "correct" : wrongPlace ? "wrong-place" : "wrong";

      newSet[word[i]] = state; // Update the state for the current letter
    }

    setLetterSetUsed(newSet);

    setPositionNumber((prevNumber) => 0);
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
              reset={handleReset}
            />
          ) : (
            <></>
          )}

          {gameOver ? (
            <button
              className="view-results"
              onClick={() => {
                setGameOverModal(true);
              }}
            >
              View resultss
            </button>
          ) : (
            <></>
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
