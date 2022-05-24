<<<<<<< HEAD
import React, { useEffect, useState, createContext } from "react";
=======
import React, { useEffect, useState } from "react";

>>>>>>> 23c8bd7d937aea11bf04e0d2060ec00d520d39d7
import { Deck } from "./deck.js";
import { MapImageToCard } from "./CardImages.js";
import Hand from "./hand.js";

import { takeSeat, mapSittingToTable } from "./gameRules.js";
import PlayGame from "./PlayGame.js";

export const playerClickedContext = createContext({
  playerPlayed: false,
  setPlayerPlayed: () => {},
});


function App() {
  const [deck, setDeck] = useState(new Deck());
  deck.shuffler();
  const [player1, setPlayer1] = useState(new Hand(deck.cards));
  const [player2, setPlayer2] = useState(new Hand(deck.cards));
  const [player3, setPlayer3] = useState(new Hand(deck.cards));
  const [player4, setPlayer4] = useState(new Hand(deck.cards));

  // Is player Played
  const [playerPlayed, setPlayerPlayed] = useState(false);
  const value = { playerPlayed, setPlayerPlayed };

  // initial load
<<<<<<< HEAD
=======
  useEffect(() => {
    takeSeat(player1, player2, player3, player4);
  }, []);


  //let order = mapSittingToTable(player1, player2, player3, player4);
>>>>>>> 23c8bd7d937aea11bf04e0d2060ec00d520d39d7

  takeSeat(player1, player2, player3, player4);

  let playersInOrder = mapSittingToTable(player1, player2, player3, player4);

  return (
    <>
      <playerClickedContext.Provider value={value}>
        <MapImageToCard {...playersInOrder} />
      </playerClickedContext.Provider>
      <PlayGame
        player1={player1}
        player2={player2}
        player3={player3}
        player4={player4}
        playerPlayed={playerPlayed}
        setPlayerPlayed={setPlayerPlayed}
      />
    </>
  );
}
export default App;
//{PlayGame(player1, player2, player3, player4)}
