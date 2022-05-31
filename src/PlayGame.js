import { useEffect, useState } from "react";
import { PlayTurn } from "./gameRules.js";
import { nextTurn } from "./gameRules.js";
import { whoPlaysFirst } from "./gameRules.js";
import { winningCard } from "./gameRules.js";
import { nextPlayer } from "./gameRules.js";
import Game from "./gameTrack.js";
import { whoPlaysFirstDefault } from "./gameRules.js";

export default function PlayGame({
  player1,
  player2,
  player3,
  player4,
  playerPlayed,
  setPlayerPlayed,
}) {
  const randomFirstPlayer = whoPlaysFirstDefault(
    player1,
    player2,
    player3,
    player4
  );
  const [gameNumber, setGameNumber] = useState(0);
  const [cardsPlayed, setcardsPlayed] = useState(0);
  const [lastwinner, setlastwinner] = useState(randomFirstPlayer);
  const [secondPlayer, setsecondPlayer] = useState();
  const [lastPlayer, setlastPlayer] = useState();
  const [winningSuit, setwinningSuit] = useState();
  const [secondPlayerBlocker, setSecondPlayerBlocker] = useState(0);

  useEffect(() => {
    console.log("1");
    PlayTurn(
      lastPlayer,
      setlastPlayer,
      winningSuit,
      setwinningSuit,
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

    if (cardsPlayed !== 0 && secondPlayerBlocker === 0) {
      setsecondPlayer(nextPlayer(lastPlayer));
      console.log("Nakon set second player");
      console.log("Broj odigranih karata", cardsPlayed);
      console.log("Second player is:", secondPlayer);

      if (cardsPlayed === 1) setSecondPlayerBlocker(1);
    }
    if (cardsPlayed > 1) {
      setlastwinner(winningCard(lastwinner, secondPlayer)); //Pobjednik ostaje
      setSecondPlayerBlocker(0);
      console.log("Best of 2 cards");
    }
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

  useEffect(() => {
    let players = [player1, player2, player3, player4];

    setlastwinner(
      whoPlaysFirst(gameNumber, lastwinner, setlastPlayer, ...players)
    );

    console.log("2");
  }, [gameNumber]);
}
