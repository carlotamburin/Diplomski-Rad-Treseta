import sample from "lodash/sample.js";
import shuffle from "lodash/shuffle.js";
import Game from "./gameTrack.js";
import { EE } from "./CardImages.js";
import { useRef, useEffect } from "react";

let TABLE_POSITION = { left: 1, up: 2, right: 1, down: 2 };
const CARD_VALUE_MAP = {
  4: 1,
  5: 2,
  6: 3,
  7: 4,
  JK: 5,
  KN: 6,
  KG: 7,
  ACE: 8,
  2: 9,
  3: 10,
};
const ONLY_POINTS = ["JK", "KN", "KG", "2", "3"];

export function takeSeat(...players) {
  let table = shuffle(Object.keys(TABLE_POSITION));

  for (let i = 0; i < players.length; i++) {
    players[i].position = table.splice(0, 1).shift();
    if (players[i].position === "down") players[i].typeOfPlayer = "human";
    else players[i].typeOfPlayer = "AI";
    players[i].team = TABLE_POSITION[players[i].position];
    Game.tableSet[players[i].position] = players[i];
  }
}
export function mapSittingToTable(...players) {
  let playersPosition = [...players];

  let sortOrder = ["up", "left", "right", "down"];

  playersPosition.sort(function (a, b) {
    return sortOrder.indexOf(a.position) - sortOrder.indexOf(b.position);
  });

  return playersPosition;
}

export async function PlayTurn(
  setlastwinner,
  setLastPlayer,
  setWiningSuit,
  lastWinner,
  secondPlayer,
  setsecondPlayer,
  cardsPlayed,
  setwinningSuitObject,
  thisTurnCards
) {
  const { hand: lastTurnWinnerHand } = lastWinner;
  console.log("Usao u playCard");
  let winningCard;
  let playedCard;

  if (cardsPlayed.current === 0) {
    if (isPlayerTurn(lastWinner)) {
      let clickedCard = await waitUserClick();
      winningCard = lastWinner.playCard(clickedCard.arg1, setlastwinner);
      console.log("Last player: played a card:", winningCard);
    } else {
      winningCard = lastWinner.playCard(
        sample(lastTurnWinnerHand),
        setlastwinner
      );
      console.log("Last player: played a card:", winningCard);
    }
    cardsPlayed.current += 1;

    thisTurnCards.current.push(winningCard);

    setwinningSuitObject(winningCard);
    setWiningSuit(winningCard.suit);
  }

  //While
  else {
    if (isPlayerTurn(secondPlayer)) {
      let clickedCard = await waitUserClick();
      playedCard = secondPlayer.playCard(clickedCard.arg1, setsecondPlayer);
      console.log("Second player: played a card:", playedCard);
    } else {
      playedCard = secondPlayer.playCard(
        sample(secondPlayer.hand),
        setsecondPlayer
      );
      console.log("Second player: played a card:", playedCard);
    }
    cardsPlayed.current += 1;
    thisTurnCards.current.push(playedCard);

    setLastPlayer(secondPlayer);
  }

  console.log("Na kraju sam PLAYTURNA");
}

export function winningCard(player1, player2, winningSuit) {
  const { currentCard: player1Card } = player1;
  const { currentCard: player2Card } = player2;

  console.log(" U winning cardu je");

  if (player1Card.suit === winningSuit) {
    if (player2Card.suit !== player1Card.suit) {
      return player1;
    }
    if (CARD_VALUE_MAP[player1Card.value] > CARD_VALUE_MAP[player2Card.value]) {
      return player1;
    }
    return player2;
  } else if (player2Card.suit === winningSuit) {
    if (player1Card.suit !== player2Card.suit) {
      return player2;
    }
    if (CARD_VALUE_MAP[player2Card.value] > CARD_VALUE_MAP[player1Card.value]) {
      return player2;
    }
    return player1;
  }
}

export function nextPlayer(lastPlayer) {
  let lastPlayerPosition = lastPlayer.position;
  let table = Object.keys(TABLE_POSITION);
  let tableLen = Object.keys(TABLE_POSITION).length;

  let indexOfLastPLayer = table.indexOf(lastPlayerPosition);
  let val = table[(((indexOfLastPLayer + 1) % tableLen) + tableLen) % tableLen];

  // console.log("The next player position " + val);
  // console.log("The next player team: " + TABLE_POSITION[val]);
  // console.log("The last player position " + indexOfLastPLayer);
  return Game.tableSet[val];
}

export function whoPlaysFirst(lastWinner, setlastPlayer) {
  let nextFirstPlayer = lastWinner;
  setlastPlayer(nextFirstPlayer);

  return nextFirstPlayer;
}

export function whoPlaysFirstDefault(player1, player2, player3, player4) {
  let players = [player1, player2, player3, player4];
  let firstPlaying = sample(players);

  return firstPlaying;
}

export function nextTurn(setGameNumber) {
  console.log("U kraju sam");
  setGameNumber((gameNumber) => {
    return gameNumber + 1;
  });
}

async function waitUserClick() {
  return await new Promise((resolve, reject) => {
    //If cards played
    EE.once("click", function listener(arg1, arg2) {
      console.log("Human played a card!");
      if (arg2 === "cardH4") resolve({ arg1, arg2 });
    });
  });
}

function isPlayerTurn(player) {
  if (player.typeOfPlayer === "human") return true;
  else return false;
}

export function handsAreEmpty(player) {
  return player.cardsInHand() === 0;
}

export function AddingCardsToTurnWinner(
  cardsThrown,
  lastTurnWinner,
  gameStats
) {
  if (lastTurnWinner.team === 1) {
    gameStats.current.team1CardsWon.push(...cardsThrown.current);
    return;
  }
  gameStats.current.team2CardsWon.push(...cardsThrown.current);
  return;
}

export function finalScore(gameStats, lastWinner) {
  let onlyTeam1 = 0;
  let pointsTeam1 = 0;
  let onlyTeam2 = 0;
  let pointsTeam2 = 0;

  for (const card of gameStats.current.team1CardsWon) {
    if (card.value === "ACE") pointsTeam1 += 1;
    else if (ONLY_POINTS.includes(card.value)) onlyTeam1 += 1;
  }
  gameStats.current.team1Points = pointsTeam1;
  gameStats.current.team1Points += coutingOnlyPoints(onlyTeam1);

  for (const card of gameStats.current.team2CardsWon) {
    if (card.value === "ACE") pointsTeam2 += 1;
    else if (ONLY_POINTS.includes(card.value)) onlyTeam2 += 1;
  }

  gameStats.current.team2Points = pointsTeam2;
  gameStats.current.team2Points += coutingOnlyPoints(onlyTeam2);

  if (lastWinner.team === 1) gameStats.current.team1Points += 1;
  else {
    gameStats.current.team2Points += 1;
  }
}

function coutingOnlyPoints(points) {
  let corretpoints = Math.floor(points / 3);

  return corretpoints;
}

export function DidIWon({ gameStats, players }) {
  let myTeam = 0;

  for (const player of players) {
    if (player.typeOfPlayer === "human") {
      myTeam = player.team;
      break;
    }
  }
  console.log(myTeam);
  console.log("U zbrajanju bodova sam")

  if (myTeam === 1) {
    if (gameStats.current.team1Points > gameStats.current.team2Points)
      return <h1>You won, congratulations!</h1>;
    return <h1>You lost :(</h1>;
  } else if (myTeam === 2) {
    if (gameStats.current.team2Points > gameStats.current.team1Points)
      return <h1>You won. congratulations!</h1>;
    return <h1>You lost :(</h1>;
  }
}

//UsePrevious
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value; //assign the value of ref to the argument
  }, [value]); //this code will run when the value of 'value' changes
  return ref.current; //in the end, return the current ref value.
}
