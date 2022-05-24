import { useEffect, useState } from "react";
import { PlayTurn } from "./gameRules.js";
import EventEmitter from "eventemitter3"

export default function PlayGame({
  player1,
  player2,
  player3,
  player4,
  playerPlayed,
  setPlayerPlayed,
}) {
  const [gameNumber, setGameNumber] = useState(0);

  useEffect(() => {

    PlayTurn(gameNumber, setGameNumber,playerPlayed,setPlayerPlayed, player1, player2, player3, player4);

    return () => {
      console.log("cleanup");
    };
  }, [gameNumber, playerPlayed, player1, player2, player3, player4, setPlayerPlayed]);
}
