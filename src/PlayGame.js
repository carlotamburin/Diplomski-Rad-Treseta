import { useEffect, useState } from "react";
import { PlayTurn } from "./gameRules.js";
import { nextTurn } from "./gameRules.js";
import { whoPlaysFirst } from "./gameRules.js";
import { winningCard } from "./gameRules.js";
import { nextPlayer } from "./gameRules.js";
import Game from "./gameTrack.js";

export default function PlayGame({
  player1,
  player2,
  player3,
  player4,
  playerPlayed,
  setPlayerPlayed,
}) {
  const [gameNumber, setGameNumber] = useState(0);
  const [cardsPlayed, setcardsPlayed] = useState(0);
  const [lastwinner, setlastwinner] = useState();
  const [secondPlayer, setsecondPlayer] = useState();

  useEffect(() => {
    let players = [player1, player2, player3, player4];

    setlastwinner(whoPlaysFirst(gameNumber, ...players));

    console.log("1");
  }, [gameNumber, lastwinner, player1, player2, player3, player4]);

  useEffect(() => {
    console.log("2");
    PlayTurn(
      lastwinner,
      secondPlayer,
      setsecondPlayer,
      cardsPlayed,
      setcardsPlayed,
      gameNumber,
      setGameNumber,
      playerPlayed,
      setPlayerPlayed
    );
    console.log(Game.lastPlayer)
    setsecondPlayer(nextPlayer(Game.lastPlayer));
    console.log(secondPlayer)
    console.log("Nakon set second player");
    if (cardsPlayed > 1) {
      setlastwinner(winningCard(lastwinner, secondPlayer)); //Pobjednik ostaje
      console.log("Best of 2 cards");
    }
    Game.lastPlayer = secondPlayer;
    if (cardsPlayed === 4) {
      nextTurn(gameNumber, setGameNumber, lastwinner);
      console.log("Sljedeci turn je");
    }
  }, [
    cardsPlayed,
    gameNumber,
    lastwinner,
    playerPlayed,
    secondPlayer,
    setPlayerPlayed,
  ]);
}
