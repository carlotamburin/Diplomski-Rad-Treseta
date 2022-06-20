import { useEffect, useState, useRef } from "react";
import { PlayTurn, useDeepCompareWithRef } from "./gameRules.js";
import { nextTurn } from "./gameRules.js";
import { whoPlaysFirst } from "./gameRules.js";
import { handsAreEmpty } from "./gameRules.js";
import { winningCard } from "./gameRules.js";
import { nextPlayer } from "./gameRules.js";
import { whoPlaysFirstDefault } from "./gameRules.js";
import { MapImageToCard } from "./CardImages.js";
import { EE } from "./CardImages.js";

export default function PlayGame({
  player1,
  player2,
  player3,
  player4,
  playersInOrder,
}) {
  const randomFirstPlayer = whoPlaysFirstDefault(
    player1,
    player2,
    player3,
    player4
  );
  const setSecondPlayerTurns = [1, 3, 5];
  const playCardTurns = [0, 2, 4, 6];
  const setLastWinnerTurns = [3, 5, 7];
  const players = [player1, player2, player3, player4];

  //states
  const [gameNumber, setGameNumber] = useState(0);
  const [cardsPlayed, setcardsPlayed] = useState(0);
  const [lastwinner, setlastwinner] = useState(randomFirstPlayer);
  const [secondPlayer, setsecondPlayer] = useState();
  const [lastPlayer, setlastPlayer] = useState(randomFirstPlayer);
  const [winningSuit, setwinningSuit] = useState();
  const [numberOfRenders, setnumberOfRenders] = useState(0);
  const [lastTurn, setlastTurn] = useState(false);
  const refSecondPlayer = useRef(secondPlayer);

  useEffect(() => {
    console.log(EE.eventNames());
    console.log(EE.listeners("click"));
    if (players.every(handsAreEmpty)) return;
    console.log("RENDER:", numberOfRenders);
    console.log("Cards played:", cardsPlayed);
    console.log("SECOND PLAYER IS :", secondPlayer);
    console.log("LAST WINNER IS :", lastwinner);

    players.forEach((el) => {
      console.log(el.cardsInHand());
    });

    setnumberOfRenders((renderNumber) => {
      return renderNumber + 1;
    });
    if (numberOfRenders === 7) setlastTurn((prevState) => !prevState);

    if (setLastWinnerTurns.includes(numberOfRenders)) {
      setlastwinner(winningCard(lastwinner, secondPlayer, winningSuit));
      console.log("Comparing winner");
    }

    if (playCardTurns.includes(numberOfRenders)) {
      PlayTurn(
        setlastwinner,
        setlastPlayer,
        setwinningSuit,
        lastwinner,
        secondPlayer,
        setsecondPlayer,
        cardsPlayed,
        setcardsPlayed
      );
    }

    if (setSecondPlayerTurns.includes(numberOfRenders)) {
      setsecondPlayer(nextPlayer(lastPlayer));
      console.log("Nakon set second player");
    }
  }, [
    gameNumber,
    cardsPlayed,
    lastwinner.currentCard,
    useDeepCompareWithRef(secondPlayer, refSecondPlayer),
  ]);

  useEffect(() => {
    console.log(numberOfRenders);
    if (numberOfRenders !== 8) return;

    setlastwinner(whoPlaysFirst(lastwinner, setlastPlayer));

    nextTurn(setGameNumber);
    setnumberOfRenders(0); //Checkiraj ovo
    setcardsPlayed(0);
    console.log("Sljedeci turn je");
  }, [lastTurn]);

  return <MapImageToCard {...playersInOrder} />;
}
