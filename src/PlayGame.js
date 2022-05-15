import { useEffect, useState } from "react";

import { PlayTurn } from "./gameRules.js";

export default function PlayGame({ player1, player2, player3, player4 }) {
  const [gameNumber, setGameNumber] = useState(0);

  useEffect(() => {
    PlayTurn(gameNumber, setGameNumber, player1, player2, player3, player4);

    return () => {
      console.log("cleanup");
    };
  }, [gameNumber, player1, player2, player3, player4]);
}
