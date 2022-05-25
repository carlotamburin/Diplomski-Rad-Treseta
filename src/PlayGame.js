import { useEffect, useState } from "react";
import { PlayTurn } from "./gameRules.js";

export default function PlayGame({
  player1,
  player2,
  player3,
  player4,
  playerPlayed,
  setPlayerPlayed,
}) {
  const [gameNumber, setGameNumber] = useState(0);
  console.log("DIKITIS")
  useEffect(() => {

    PlayTurn(gameNumber, setGameNumber,playerPlayed,setPlayerPlayed, player1, player2, player3, player4);

    return () => {
      console.log("cleanup");
    };
  }, [gameNumber,setGameNumber, playerPlayed, player1, player2, player3, player4, setPlayerPlayed]);
}
