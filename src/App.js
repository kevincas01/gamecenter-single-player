import  './App.css'

import React, { useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Connections from './Components/Connections';
import Wordle from './Components/Wordle';

import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function GameCenter() {
  const [currentCard, setCurrentCard] = useState(0);

  // Stabilize refs by storing them in a useRef array
  const cardRefs = useRef([]);
  // Scroll to the specified card
  const scrollToCard = (index) => {

    const ref = cardRefs.current[index];
    if (ref) {
      ref.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
    setCurrentCard(index);
  };

  const handleCardChange = (offset) => {
    let newCardIndex = (currentCard + offset);
    scrollToCard(newCardIndex);
  };

  const cardInformation = [
    {
      value: "Wordle",
      text: "Wordle",
      htmlElement: <Wordle />,
    },
    {
      value: "Connections",
      text: "Connections",
      htmlElement: <Connections />,
    },
  ];

  return (
    <>
      <div className="carousal-container">
        {currentCard > 0 && (
          <button
            className="card-button"
            id="left"
            onClick={() => handleCardChange(-1)}
          >
            <ChevronLeftIcon fontSize="inherit" />
          </button>
        )}

        {currentCard < cardInformation.length - 1 && (
          <button
            className="card-button"
            id="right"
            onClick={() => handleCardChange(1)}
          >
            <ChevronRightIcon fontSize="inherit" />
          </button>
        )}

        <div className="carousal-cards">
          {cardInformation.map((card, index) => (
            <div
              key={index}
              className="carousal-card"
              ref={(el) => (cardRefs.current[index] = el)} // Stabilize refs
            >
              <div className="game_chosen">{card.htmlElement}</div>
            </div>
          ))}
          
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default GameCenter;