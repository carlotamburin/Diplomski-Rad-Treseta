import React, { useEffect, useState } from "react";

import { Deck } from "./deck.js";
import { MapImageToCard } from "./CardImages.js";
import Hand from "./hand.js";

import { takeSeat } from "./gameRules.js";
import { PlayGame } from "./PlayGame.js";

function App() {
  const [deck, setDeck] = useState(new Deck());
  deck.shuffler();
  const [player1, setPlayer1] = useState(new Hand(deck.cards));
  const [player2, setPlayer2] = useState(new Hand(deck.cards));
  const [player3, setPlayer3] = useState(new Hand(deck.cards));
  const [player4, setPlayer4] = useState(new Hand(deck.cards));

  // initial load
  useEffect(() => {
    takeSeat(player1, player2, player3, player4);
  }, []);

  // useEffect(() => {
  //   playTurn(player1, player2, player3, player4);
  // }, [Game.gameNumber]);

  return (
    <>
      <MapImageToCard
        hand1={player1.hand}
        hand2={player2.hand}
        hand3={player3.hand}
        hand4={player4.hand}
      />
      <PlayGame
        player1={player1}
        setPlayer1={setPlayer1}
        player2={player2}
        setPlayer2={setPlayer2}
        player3={player3}
        setPlayer3={setPlayer3}
        player4={player4}
        setPlayer4={setPlayer4}
      />
    </>
  );
}

export default App;
