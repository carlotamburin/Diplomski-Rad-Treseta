import { useEffect, useState, useRef, useMemo } from "react";
import {
  AddingCardsToTurnWinner,
  PlayTurn,
  finalScore,
  usePrevious,
} from "./gameRules.js";
import { nextTurn } from "./gameRules.js";
import { whoPlaysFirst } from "./gameRules.js";
import { handsAreEmpty } from "./gameRules.js";
import { winningCard } from "./gameRules.js";
import { nextPlayer } from "./gameRules.js";
import { whoPlaysFirstDefault } from "./gameRules.js";
import { MapImageToCard } from "./CardImages.js";
import { NewGame } from "./NewGame";

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
  const [secondPlayer, setsecondPlayer] = useState({});
  const [lastPlayer, setlastPlayer] = useState(randomFirstPlayer);
  const [winningSuit, setwinningSuit] = useState();
  const [lastTurn, setlastTurn] = useState(false);
  const [winningSuitObject, setwinningSuitObject] = useState({});

  //useMemo
  const lastPlayerMemo = useMemo(() => {
    return lastPlayer;
  }, [lastPlayer]);
  const secondPlayerMemo = useMemo(() => {
    return secondPlayer;
  }, [secondPlayer]);
  const lastwinnerMemo = useMemo(() => {
    return lastwinner;
  }, [lastwinner]);

  //useRef
  const cardsPlayed = useRef(0);
  const numberOfRenders = useRef(0);
  const thisTurnCards = useRef([]);
  const gameStats = useRef({
    team1CardsWon: [],
    team2CardsWon: [],
    team1Points: 0,
    team2Points: 0,
    gameNumber: 0,
    isEnd: false,
  });

  useEffect(() => {
    const setSecondPlayerTurns = [1, 3, 5];
    const playCardTurns = [0, 2, 4, 6];
    const setLastWinnerTurns = [3, 5, 7];
    const players = [player1, player2, player3, player4];

    if (players.every(handsAreEmpty) && numberOfRenders.current === 0) {
      return;
    }

    console.log("RENDER:", numberOfRenders.current);
    console.log("Cards played:", cardsPlayed.current);
    console.log("SECOND PLAYER IS :", secondPlayer);
    console.log("LAST WINNER IS :", lastwinner);

    if (numberOfRenders.current === 7) {
      setTimeout(() => {
        setlastTurn((prevState) => !prevState);
      }, 1500);
    }

    if (setLastWinnerTurns.includes(numberOfRenders.current)) {
      setlastwinner(winningCard(lastwinner, secondPlayer, winningSuit));
    }

    if (playCardTurns.includes(numberOfRenders.current)) {
      setTimeout(() => {
        PlayTurn(
          setlastwinner,
          setlastPlayer,
          setwinningSuit,
          lastwinner,
          secondPlayer,
          setsecondPlayer,
          cardsPlayed,
          setwinningSuitObject,
          thisTurnCards
        );
      }, 1000);
    }

    if (setSecondPlayerTurns.includes(numberOfRenders.current)) {
      setsecondPlayer(nextPlayer(lastPlayer));
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
    gameNumber,
    winningSuitObject,
  ]);

  useEffect(() => {
    if (numberOfRenders.current <= 7) return;

    setlastwinner(whoPlaysFirst(lastwinner, setlastPlayer));
    AddingCardsToTurnWinner(thisTurnCards, lastwinner, gameStats);
    setsecondPlayer({});
    nextTurn(setGameNumber);
    numberOfRenders.current = 0;
    cardsPlayed.current = 0;
    console.log(thisTurnCards.current);
    thisTurnCards.current = [];

    //Temp
    finalScore(gameStats, lastwinner);
    console.log(gameStats.current);
    gameStats.current.gameNumber += 1;
    gameStats.current.isEnd = true;
    console.log("It's next turn");
  }, [lastTurn, lastwinner]);

  const players = [player1, player2, player3, player4];

  if (!players.every(handsAreEmpty))
    return <MapImageToCard cards={thisTurnCards} players={playersInOrder} />;
  if (gameStats.current.isEnd === true && numberOfRenders.current === 0)
    return <NewGame gameStats={gameStats} players={playersInOrder} />;
}
