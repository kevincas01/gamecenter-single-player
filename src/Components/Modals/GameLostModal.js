import React from "react";
import BaseModal from "./BaseModal";
import "../../Styles/modals.css";
import { emojiTiles, getEmojiTiles } from "../../lib/connectionsUtils";

const GameLostModal = ({
  open,
  closeModal,
  reset,
  correctWord,
  guesses,
  gameType,
}) => {
  if (!open) return null;
  const displayGameResults = () => {
    switch (gameType) {
      case "wordle":
        return (
          <div className="modal-content">
            <p className="result-message">
              The correct word was:{" "}
              <span className="highlight">{correctWord}</span>
            </p>
            <p>Your Guesses:</p>
            <div className="guesses-grid">
              {guesses.map((guessRow, rowIndex) => (
                <div key={rowIndex} className="guess-row">
                  {guessRow.map((state, cellIndex) => (
                    <div
                      key={cellIndex}
                      className={`wordle-guess-cell ${state}`}
                      title={state} // Tooltip for state
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      case "connections":
        return (
          <div className="modal-content">
            <p className="result-message">Connections Game Results! </p>
            <p>Your Guesses:</p>
            <div className="guesses-grid">
              {guesses.map((guessRow, rowIndex) => (
                <div key={rowIndex} className="guess-row">
                  {guessRow.map((guess, cellIndex) => (
                    <div
                      key={cellIndex}
                      className={`connections-guess-cell level${guess.level}`}
                      title={guess.level} // Tooltip for state
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
    }
  };
  return (
    <BaseModal title="You Lost :{" close={closeModal}>
      {displayGameResults()}{" "}
      <div className="modal-actions">
        <button className="btn reset-btn" onClick={reset}>
          Reset Game
        </button>
        <button className="btn share-btn">Share Results</button>
      </div>
    </BaseModal>
  );
};

export default GameLostModal;
