import React, { useState } from "react";

import "react-toastify/dist/ReactToastify.css";

import Connections from "./Connections";
import Wordle from "./Wordle";

function GameCenter() {
  const [gameChosen, setGameChosen] = useState("Connections");

  const games = {
    Wordle: <Wordle />,
    Connections: <Connections />,
    //"Checkers":<CheckerBoard player={playerPiece}/>
  };

  const chooseGame = (game) => {
    setGameChosen(game);
  };

  return (
    <>
      <div className="gamecenter_container">
        <div className="choose_games_container">
          <button
            onClick={() => {
              chooseGame("Wordle");
            }}
          >
            Wordle
          </button>
          <button
            onClick={() => {
              chooseGame("Connections");
            }}
          >
            Connections
          </button>
        </div>

        <hr />

        <div className="game_chosen">{games[gameChosen]}</div>
      </div>
    </>
  );
}

export default GameCenter;
