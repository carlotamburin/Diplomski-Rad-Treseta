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
  const setSecondPlayerTurns = [1, 3, 5];
  const playCardTurns = [0, 2, 4, 6];

  //states
  const [gameNumber, setGameNumber] = useState(0);
  const [cardsPlayed, setcardsPlayed] = useState(0);
  const [lastwinner, setlastwinner] = useState(randomFirstPlayer);
  const [secondPlayer, setsecondPlayer] = useState();
  const [lastPlayer, setlastPlayer] = useState();
  const [winningSuit, setwinningSuit] = useState();
  const [numberOfRenders, setnumberOfRenders] = useState(0);
  const [lastWinnerCurrCard, setLastWinnerCurrCard] = useState();
  const [secondPlayerCurrentCard, setsecondPlayerCurrentCard] = useState();

  useEffect(() => {
    console.log("RENDER:", numberOfRenders);
    console.log("Cards played:", cardsPlayed);
    setnumberOfRenders(numberOfRenders + 1);
    if ([3, 4, 6].includes(numberOfRenders)) {
      setlastwinner(winningCard(lastwinner, secondPlayer, winningSuit)); //Pobjednik ostaje u lastWinneru
      // Tu je negdi bug
      console.log("Comparing winner");
    }

    if (playCardTurns.includes(numberOfRenders)) {
      PlayTurn(
        lastWinnerCurrCard,
        setLastWinnerCurrCard,
        secondPlayerCurrentCard,
        setsecondPlayerCurrentCard,
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
    }

    if (setSecondPlayerTurns.includes(numberOfRenders)) {
      setsecondPlayer(nextPlayer(lastPlayer));
      console.log("Nakon set second player");
      console.log("Second player is:", secondPlayer);
    }

    let players = [player1, player2, player3, player4];
    if (numberOfRenders === 6) {
      console.log("Tko igra sljedeci next turn");

      setlastwinner(
        whoPlaysFirst(gameNumber, lastwinner, setlastPlayer, ...players)
      );
    }

    if (numberOfRenders === 6) {
      nextTurn(gameNumber, setGameNumber, lastwinner, setcardsPlayed);
      setcardsPlayed(0);
      setnumberOfRenders(0); //Checkiraj ovo
      console.log("Sljedeci turn je");
    }
  }, [gameNumber, lastwinner, playerPlayed, secondPlayer]);
}

//Jer kad su 3 odigrane znaci da su 4 zapravo
