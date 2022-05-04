import React, { useState } from "react";
import { isEmpty } from "lodash";
import { Deck } from "./deck.js";
import { MapImageToCard } from "./CardImages.js";
import Hand from "./hand.js";
import { playTurn, takeSeat, useFrameLoop } from "./gameRules.js";

function App() {
  const [time, setTime] = useState(0);
  const [deltaTime, setDeltaTime] = useState(0);

  // initial load
  const deck = new Deck();
  deck.shuffler();
  const player1 = new Hand(deck.cards);
  const player2 = new Hand(deck.cards);
  const player3 = new Hand(deck.cards);
  const player4 = new Hand(deck.cards);
  takeSeat(player1, player2, player3, player4);

  useFrameLoop((time, deltaTime) => {
    // To je taj game loop
    setTime(time);
    setDeltaTime(deltaTime);
  });

  playTurn(player1, player2, player3, player4); //Ovo mi je turn i logika zelim da se samo jednom izvrši te nakon nekog uvjeta opet dok ne dode do kraja igre a ne 60 puta u sekundi

  return <MapImageToCard card={player1.hand[2]} />; // Ovo je iscrtavanje karata (tu bi tia da gleda jeli se state karata prominia i rerendera ruku)
}
export default App;
