import React, { useEffect, useRef } from "react";
import { CONNECTION_GAMES, DIFFICULTIES } from "../Data/connectionsData.js";

import "../Styles/connections.css";

import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  checkAlreadySolved,
  checkAlreadySubmitted,
  checkIfCorrect,
  differenceOfArrays,
  shuffleArray,
} from "../lib/connectionsUtils.js";

import GameWonModal from "./Modals/GameWonModal";
import GameLostModal from "./Modals/GameLostModal";

const SolvedCard = ({ solvedCategory }) => {
  return (
    <div
      className="solved-category"
      style={{ backgroundColor: `var(${DIFFICULTIES[solvedCategory.level]})` }}
    >
      <p style={{ fontSize: "18px", textAlign: "center" }}>
        <span>{solvedCategory.group}</span>
        <br></br>
        {solvedCategory.words.join(", ").toUpperCase()}
      </p>
    </div>
  );
};

const Card = ({ word, selected, handleClick }) => {
  const cardContainerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    resizeText();
    window.addEventListener("resize", resizeText);
    return () => {
      window.removeEventListener("resize", resizeText);
    };
  }, []);

  const resizeText = () => {
    const container = cardContainerRef.current;
    const text = textRef.current;
    const containerWidth = container.offsetWidth;

    if (!container || !text || text.offsetWidth < containerWidth) return;

    let min = 1;
    let max = 20;
    while (min <= max) {
      const mid = Math.floor((min + max) / 2);
      text.style.fontSize = mid + "px";
      if (text.offsetWidth <= containerWidth) {
        min = mid + 1;
      } else {
        max = mid - 1;
      }
    }
    text.style.fontSize = max + "px";
  };

  return (
    <div
      ref={cardContainerRef}
      className={`card ${selected ? "selected" : ""}`}
      style={{ fontSize: word.length > 6 ? "12px" : "16px" }}
      onClick={() => {
        handleClick();
      }}
    >
      <span ref={textRef}>{word.word}</span>
    </div>
  );
};

const Connections = () => {
  const [gameStart, setGameStart] = React.useState(false);

  const [gameWon, setGameWon] = React.useState(false);
  const [gameOver, setGameOver] = React.useState(false);
  const [gameOverModal, setGameOverModal] = React.useState(false);

  const [gameSolution, setGameSolution] = React.useState([]);
  const [wordsSelected, setWordsSelected] = React.useState([]);

  const [previousSubmissions, setPreviousSubmissions] = React.useState([]);
  const [attemptsLeft, setAttemptsLeft] = React.useState(4);

  const [solvedCategories, setSolvedCategories] = React.useState([]);

  const [gameWords, setGameWords] = React.useState([]);

  React.useEffect(() => {
    if (!gameOver) {
      return;
    }

    const modalDelay = gameWon ? 2000 : 4000;
    const delayModalOpen = window.setTimeout(() => {
      setGameOverModal(true);
      // unmount confetti after modal opens
      // setShowConfetti(false);
    }, modalDelay);

    // Define a recursive function to process each group with a delay
    const showCorrectAnswers = (currentIndex) => {
      // Base case: stop recursion when all groups have been processed
      if (currentIndex >= gameSolution.answers.length) {
        return;
      }

      const currentSolution = gameSolution.answers[currentIndex];

      // Check if the group has already been solved
      if (!solvedCategories.includes(currentSolution.level)) {
        // Process the current group
        setGameWords((prevGameWords) =>
          prevGameWords.filter(
            (gameWord) => gameWord.level !== currentSolution.level
          )
        );
        setSolvedCategories((prevSolvedCategories) => [
          ...prevSolvedCategories,
          currentSolution.level,
        ]);

        // Call the function recursively to process the next group after a delay of 1 second
        setTimeout(() => {
          showCorrectAnswers(currentIndex + 1);
        }, 1000);
      } else {
        // If the group has already been solved, move to the next group immediately
        showCorrectAnswers(currentIndex + 1);
      }
    };

    // Start processing groups from index 0
    setTimeout(() => {
      showCorrectAnswers(0);
    }, 500);

    // Return a cleanup function to clear the timeout and interval
    return () => {
      clearTimeout(delayModalOpen);
    };
  }, [gameOver]);

  const makeGameWordsArray = (selectedGame) => {
    let updatedWords = [];

    for (let i = 0; i < selectedGame.answers.length; i++) {
      for (let w = 0; w < selectedGame.answers[i].words.length; w++) {
        updatedWords = [
          ...updatedWords,
          {
            level: selectedGame.answers[i].level,
            word: selectedGame.answers[i].words[w],
          },
        ];
      }
    }
    return updatedWords;
  };

  const startConnectionsGame = () => {
    const index = Math.floor(Math.random() * CONNECTION_GAMES.length);

    const selectedGame = CONNECTION_GAMES[index];

    const gameWords = makeGameWordsArray(selectedGame);
    const shuffledWords = shuffleArray(gameWords);

    setGameStart(true);
    setGameSolution(selectedGame);

    // Update the state with the shuffled array
    setGameWords(shuffledWords);
  };

  const handleWordSelect = (word) => {
    let currentWordsSelected;
    if (wordsSelected.includes(word)) {
      currentWordsSelected = wordsSelected.filter((w) => word !== w);

      setWordsSelected(currentWordsSelected);
      return;
    }

    if (wordsSelected.length === 4) return;

    currentWordsSelected = [...wordsSelected, word];

    setWordsSelected(currentWordsSelected);
  };

  const shuffleWords = (e) => {
    e.preventDefault();

    setGameWords((prevGameWords) => {
      const shuffledWords = shuffleArray(prevGameWords);
      return [...shuffledWords];
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (checkAlreadySubmitted(previousSubmissions, wordsSelected)) {
      toast("Already guessed!", {
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

    const prevAttempts = [...previousSubmissions, [...wordsSelected]];
    setPreviousSubmissions(prevAttempts);

    const result = checkIfCorrect(wordsSelected);

    let solutions;

    if (result.isCorrect) {
      let newGameWords = differenceOfArrays(gameWords, wordsSelected);

      setGameWords(newGameWords);
      setWordsSelected([]);
      setSolvedCategories((prevSolvedLevels) => [
        ...prevSolvedLevels,
        result.level,
      ]);
      if (solvedCategories.length === 3) {
        setGameOver(true);
        setGameWon(true);
      }
    } else if (result.isOneGuessAway) {
      if (attemptsLeft === 1) {
        toast("YOU LOST", {
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

        setWordsSelected([]);
        setGameOver(true);
      } else {
        toast("One Guess away!", {
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
      }
      setAttemptsLeft(attemptsLeft - 1);
    } else {
      if (attemptsLeft === 1) {
        toast("YOU LOST", {
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

        //TO DO; SET TIMEOUTS SO THE ANSWERS COULD BE SHOWN ONE BY ONE

        setWordsSelected([]);
        setGameOver(true);
      } else {
        toast("Wrong Answer", {
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
      }

      setAttemptsLeft(attemptsLeft - 1);
    }
  };

  const handleReset = () => {
    setAttemptsLeft();
    setGameWon(false);
    setGameOver(false);

    setGameOverModal(false);

    setWordsSelected([]);

    setPreviousSubmissions([]);
    setAttemptsLeft(4);

    setSolvedCategories([]);

    const index = Math.floor(Math.random() * CONNECTION_GAMES.length);

    const selectedGame = CONNECTION_GAMES[index];

    const gameWords = makeGameWordsArray(selectedGame);
    const shuffledWords = shuffleArray(gameWords);

    setGameSolution(selectedGame);

    // Update the state with the shuffled array
    setGameWords(shuffledWords);
  };

  const closeModal = () => {
    setGameOverModal(false);
  };
  return (
    <div className="connections-container">
      <h1>Connnections</h1>

      {!gameStart ? (
        <div className="game_start_container">
          <h2>How to play Connections</h2>

          <div>
            <h3>Find groups of four items that share something in common.</h3>
            <ul>
              <li>
                Select four items and tap 'Submit' to check if your guess is
                correct
              </li>
              <li>Find the groups without making 4 mistakes!</li>
            </ul>
          </div>

          <div>
            <h3>Category Examples:</h3>
            <ul>
              <li>FISH: Bass, Flounder, Salmon, Trout</li>
              <li>FIRE ___: Ant, Drill, Island, Opal</li>
            </ul>
          </div>
          <p>
            Categories will always be more specific than "5-LETTER WORDS,"
            "NAMES," or "VERBS."
          </p>
          <p>
            Each puzzle has exactly one solution. Watych out for words that seem
            to belong to multiple categories!
          </p>
          <p>
            Each group is assigned a color, which will be revealed as you solve:
          </p>
          <button onClick={startConnectionsGame}>Start Connections Game</button>
        </div>
      ) : (
        <>
          <div className="card-container">
            {solvedCategories.map((solvedIndex, index) => (
              <SolvedCard
                key={index}
                solvedCategory={gameSolution.answers[solvedIndex]}
              ></SolvedCard>
            ))}

            {gameWords.map((word, index) => (
              <Card
                key={index}
                word={word}
                selected={wordsSelected.includes(word)}
                handleClick={() => handleWordSelect(word)}
              ></Card>
            ))}
          </div>

          <div className="attempts-remaining">
            <span id="attempts-remaining-text">Mistakes remaining:</span>
            <span id="attempts-remaining-bubbles">
              {Array(attemptsLeft)
                .fill()
                .map((_, index) => (
                  <span key={index} className="black-circle"></span>
                ))}
            </span>
          </div>

          {gameOver && gameWon ? (
            <GameWonModal
              open={gameOverModal}
              closeModal={closeModal}
              reset={handleReset}
              gameType={"connections"}
              guesses={previousSubmissions}
            />
          ) : gameOver && !gameWon ? (
            <GameLostModal
              open={gameOverModal}
              closeModal={closeModal}
              reset={handleReset}
              gameType={"connections"}
              guesses={previousSubmissions}
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
              View results
            </button>
          ) : (
            <div className="button-group">
              <button className="connections-button" onClick={shuffleWords}>
                Shuffle
              </button>
              <button
                className="connections-button"
                onClick={() => {
                  setWordsSelected([]);
                }}
              >
                {" "}
                Deselect All
              </button>
              <button
                className="connections-button"
                onClick={handleSubmit}
                disabled={wordsSelected.length !== 4}
                style={{
                  border:
                    wordsSelected.length !== 4
                      ? "2px solid gray"
                      : "2px solid black",
                  color: wordsSelected.length !== 4 ? "gray" : "white",
                  backgroundColor:
                    wordsSelected.length !== 4 ? "white" : "black",
                }}
              >
                Submit
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Connections;
