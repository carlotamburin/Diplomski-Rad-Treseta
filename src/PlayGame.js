import { useEffect, useState } from "react";

import { playTurn } from "./gameRules.js";

export function PlayGame({ player1, player2, player3, player4 }) {
  const [gameNumber, setGameNumber] = useState(0);


  useEffect(() => {
    playTurn(gameNumber, setGameNumber, player1, player2, player3, player4);
  }, [gameNumber, player1, player2, player3, player4]);
}
