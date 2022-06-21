import sample from "lodash/sample.js";
import shuffle from "lodash/shuffle.js";
import Game from "./gameTrack.js";
import { EE } from "./CardImages.js";
import { isEqual } from "lodash";

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
  setnextTurnFlag
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

export function deepCompareEquals(prevVal, currentVal) {
  return isEqual(prevVal, currentVal);
}

export function useDeepCompareWithRef(value, prevValue) {
  if (!deepCompareEquals(value, prevValue.current)) {
    prevValue.current = value;
  }

  return prevValue.current;
}
