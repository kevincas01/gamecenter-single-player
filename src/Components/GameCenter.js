import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Connections from "./Connections";
import Wordle from "./Wordle";

function GameCenter() {
  const [currentCard, setCurrentCard] = React.useState(0);

  // Scroll to the specified card
  const scrollToCard = (index) => {
    const ref = cardRefs[index];

    // Ensure ref is not null and is a div element
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }

    setCurrentCard(index);
  };

  // Type cardRefs as an array of refs pointing to HTMLDivElement
  const cardRefs = [React.createRef(), React.createRef()];
  const handleCardChange = (offset) => {
    const totalCards = cardRefs.length;
    let newCardIndex = (currentCard + offset) % totalCards;
    if (newCardIndex < 0) {
      newCardIndex = totalCards - 1;
    }
    setCurrentCard(newCardIndex);
    scrollToCard(newCardIndex);
  };

  const cardInformation = [
    {
      value: "Wordle",
      text: "Wordle",
      htmlElement: <Wordle />,
      cardRef: cardRefs[0],
    },
    {
      value: "Connections",
      text: "Connections",
      htmlElement: <Connections />,
      cardRef: cardRefs[1],
    },
  ];

  return (
    <>
      <div className="carousal-container">
        <button
          className="card-button"
          id="left"
          onClick={() => {
            handleCardChange(-1);
          }}
        >
         <ChevronLeftIcon fontSize="inherit"/>
        </button>
        <button
          className="card-button"
          id="right"
          onClick={() => {
            handleCardChange(+1);
          }}
        >
          <ChevronRightIcon fontSize="inherit"/>
        </button>

        <div className="carousal-cards">
          {cardInformation &&
            cardInformation.map((card, index) => (
              <div
                key={index}
                className="carousal-card"
                ref={card.cardRef} // Reference to each card
              >
                <div className="game_chosen">{card.htmlElement}</div>
              </div>
            ))}
          <div className="extra-margin"></div>
        </div>
      </div>
    </>
  );
}

export default GameCenter;
