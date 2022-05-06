import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { Deck } from "./deck.js";
import { MapImageToCard } from "./CardImages.js";
import Hand from "./hand.js";
import Game from "./gameTrack.js";
import { playTurn, takeSeat } from "./gameRules.js";

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
  }, [Game.gameNumber]);

  useEffect(() => {
    playTurn(player1, player2, player3, player4);
  });

  return (
    <MapImageToCard
      hand1={player1.hand}
      hand2={player2.hand}
      hand3={player3.hand}
      hand4={player4.hand}
    />
  );
}
export default App;
