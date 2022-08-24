import { useEffect, useState, useRef } from "react";
import { AddingCardsToTurnWinner, PlayTurn, finalScore } from "./gameRules.js";
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
  const [turnNumber, setTurnNumber] = useState(0);
  const [lastwinner, setlastwinner] = useState(randomFirstPlayer);
  const [secondPlayer, setsecondPlayer] = useState({});
  const [lastPlayer, setlastPlayer] = useState(randomFirstPlayer);
  const [winningSuit, setwinningSuit] = useState();
  const [lastTurn, setlastTurn] = useState(false);
  const [winningSuitObject, setwinningSuitObject] = useState({});

  //Timeri
  const breakBetweenCardsPlayed = useRef();
  const lastPlayerWonBreak = useRef();

  //useRef
  const isFirstPlayer = useRef(false);
  const cardsPlayed = useRef(0);
  const numberOfRenders = useRef(0);
  const thisTurnCards = useRef([]);
  const gameStats = useRef({
    team1CardsWon: [],
    team2CardsWon: [],
    team1Points: 0,
    team2Points: 0,
    gameNumber: 0,
    turnNumber: 0,
    team1Striscio: {
      left: { K: false, D: false, B: false, S: false },
      right: { K: false, D: false, B: false, S: false },
    },
    team2Striscio: {
      up: { K: false, D: false, B: false, S: false },
      down: { K: false, D: false, B: false, S: false },
    },
    team1Knocking: false,
    team2Knocking: false,
    team1Knocked: false,
    team2Knocked: false,
    playerKnockingSuit: "",
    team1Napola: { K: false, D: false, B: false, S: false },
    team2Napola: { K: false, D: false, B: false, S: false },
    team1NapolaPlayed: false,
    team2NapolaPlayed: false,
    team1HaveNapola: false,
    team2HaveNapola: false,
    lastTurnWinner: 0,
    isEnd: false,
    cardsInQue: { left: [], up: [], right: [], down: [] },
  });

  useEffect(() => {
    const setSecondPlayerTurns = [1, 3, 5];
    const playCardTurns = [0, 2, 4, 6];
    const setLastWinnerTurns = [3, 5, 7];
    const players = [player1, player2, player3, player4];

    if (players.every(handsAreEmpty) && numberOfRenders.current === 0) {
      gameStats.current.gameNumber += 1;
      return;
    }

    console.log("RENDER:", numberOfRenders.current);
    console.log("Cards played:", cardsPlayed.current);
    console.log("SECOND PLAYER IS :", secondPlayer);
    console.log("LAST WINNER IS :", lastwinner);

    if (numberOfRenders.current === 7) {
      setlastTurn((prevState) => !prevState);
    }

    if (setLastWinnerTurns.includes(numberOfRenders.current)) {
      setlastwinner(winningCard(lastwinner, secondPlayer, winningSuit));
    }

    if (playCardTurns.includes(numberOfRenders.current)) {
      breakBetweenCardsPlayed.current = setTimeout(() => {
        PlayTurn(
          setlastwinner,
          setlastPlayer,
          setwinningSuit,
          lastwinner,
          secondPlayer,
          setsecondPlayer,
          cardsPlayed,
          setwinningSuitObject,
          thisTurnCards,
          gameStats,
          isFirstPlayer,
          players,
          winningSuit
        );
      }, 1000);
    }

    if (setSecondPlayerTurns.includes(numberOfRenders.current)) {
      setsecondPlayer(nextPlayer(lastPlayer));
    }

    numberOfRenders.current += 1;

    return () => {
      clearTimeout(breakBetweenCardsPlayed.current);
    };
  }, [
    lastPlayer,
    secondPlayer,
    lastwinner,
    player1,
    player2,
    player3,
    player4,
    winningSuit,
    turnNumber,
    winningSuitObject,
  ]);

  useEffect(() => {
    if (numberOfRenders.current <= 7) return;
    lastPlayerWonBreak.current = setTimeout(() => {
      whoPlaysFirst(lastwinner, setlastPlayer);
      AddingCardsToTurnWinner(thisTurnCards, lastwinner, gameStats);
      setsecondPlayer({});
      nextTurn(setTurnNumber);
      numberOfRenders.current = 0;
      cardsPlayed.current = 0;
      thisTurnCards.current = [];
      gameStats.current.turnNumber += 1;
      gameStats.current.lastTurnWinner = lastwinner.team;

      finalScore(gameStats, lastwinner);
      gameStats.current.isEnd = true;

    }, 1000);

    return () => {
      clearTimeout(lastPlayerWonBreak.current);
    };
  }, [lastTurn, lastwinner]);

  const players = [player1, player2, player3, player4];

  if (!players.every(handsAreEmpty))
    return <MapImageToCard cards={thisTurnCards} players={playersInOrder} />;

  if (gameStats.current.isEnd === true && numberOfRenders.current === 0)
    return <NewGame gameStats={gameStats} players={playersInOrder} />;
}
