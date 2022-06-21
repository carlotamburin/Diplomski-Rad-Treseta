import { useEffect, useState, useRef, useMemo } from "react";
import { PlayTurn, useDeepCompareWithRef } from "./gameRules.js";
import { nextTurn } from "./gameRules.js";
import { whoPlaysFirst } from "./gameRules.js";
import { handsAreEmpty } from "./gameRules.js";
import { winningCard } from "./gameRules.js";
import { nextPlayer } from "./gameRules.js";
import { whoPlaysFirstDefault } from "./gameRules.js";
import { MapImageToCard } from "./CardImages.js";

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

  //states
  const [gameNumber, setGameNumber] = useState(0);
  const [lastwinner, setlastwinner] = useState(randomFirstPlayer);
  const [secondPlayer, setsecondPlayer] = useState();
  const [lastPlayer, setlastPlayer] = useState(randomFirstPlayer);
  const [winningSuit, setwinningSuit] = useState();
  const [lastTurn, setlastTurn] = useState(false);
  const [nextTurnFlag, setnextTurnFlag] = useState(false);
  // Kemijanje
  const refSecondPlayer = useRef(secondPlayer);
  const cardsPlayed = useRef(0);
  const numberOfRenders = useRef(0);
  const lastPlayerMemo = useMemo(() => {
    return lastPlayer;
  }, [lastPlayer]);
  const secondPlayerMemo = useMemo(() => {
    return secondPlayer;
  }, [secondPlayer]);
  const lastwinnerMemo = useMemo(() => {
    return lastwinner;
  }, [lastwinner]);

  useEffect(() => {
    const setSecondPlayerTurns = [1, 3, 5];
    const playCardTurns = [0, 2, 4, 6];
    const setLastWinnerTurns = [3, 5, 7];
    const players = [player1, player2, player3, player4];

    console.log("Are hands empty:", players.every(handsAreEmpty));
    if (players.every(handsAreEmpty)) return;
    console.log("RENDER:", numberOfRenders.current);
    console.log("Cards played:", cardsPlayed.current);
    console.log("SECOND PLAYER IS :", secondPlayer);
    console.log("LAST WINNER IS :", lastwinner);

    players.forEach((el) => {
      console.log(el.cardsInHand());
    });

    if (numberOfRenders.current === 7) setlastTurn((prevState) => !prevState);

    if (setLastWinnerTurns.includes(numberOfRenders.current)) {
      setlastwinner(winningCard(lastwinner, secondPlayer, winningSuit));

      console.log(
        "After comparing winner, winner is:",
        winningCard(lastwinner, secondPlayer, winningSuit)
      );
    }

    if (playCardTurns.includes(numberOfRenders.current)) {
      PlayTurn(
        setlastwinner,
        setlastPlayer,
        setwinningSuit,
        lastwinner,
        secondPlayer,
        setsecondPlayer,
        cardsPlayed,
        setnextTurnFlag
      );
    }

    if (setSecondPlayerTurns.includes(numberOfRenders.current)) {
      setsecondPlayer(nextPlayer(lastPlayer));
      console.log("Nakon set second player");
      //console.log(nextPlayer(lastPlayer).position);
    }

    numberOfRenders.current += 1;
  }, [
    lastPlayerMemo,
    secondPlayerMemo,
    lastwinnerMemo,
    player1,
    player2,
    player3,
    player4,
    winningSuit,
  ]);

  useEffect(() => {
    if (numberOfRenders.current !== 8) return;

    setlastwinner(whoPlaysFirst(lastwinner, setlastPlayer));

    nextTurn(setGameNumber);
    numberOfRenders.current = 0;
    cardsPlayed.current = 0;

    console.log("It's next turn");
  }, [lastTurn, lastwinner]);

  return <MapImageToCard {...playersInOrder} />;
}
