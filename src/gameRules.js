import sample from "lodash/sample.js";
import shuffle from "lodash/shuffle.js";
import Game from "./gameTrack.js";

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
    players[i].team = TABLE_POSITION[players[i].position];
    Game.tableSet[players[i].position] = players[i];
  }
}

// function lastTurnWinner(player1, player2, player3, player4) {
//   let lastTurnWinner = {};
//   for (let i = 0; i < arguments.length; i++) {
//     const player = arguments[i];
//     if (player.winner) {
//       lastTurnWinner = Game.lastPlayer = player;
//       return lastTurnWinner;
//     }
//   }
// }

export function playTurn(gameNumber, setGameNumber, ...players) {
  let cardsThrown = 0;

  let lastWinner = whoPlaysFirst(gameNumber, ...players);

  const { hand: lastTurnWinnerHand } = lastWinner;

  lastWinner.currentCard = lastWinner
    .playCard(sample(lastTurnWinnerHand))
    .shift();
  Game.winningSuit = lastWinner.currentCard.suit;
  cardsThrown += 1;
  console.log(lastWinner.currentCard);

  while (cardsThrown !== 4) {
    let secondPlayer = nextPlayer(Game.lastPlayer);
    console.log("Second player je " + JSON.stringify(secondPlayer));
    secondPlayer.currentCard = secondPlayer
      .playCard(sample(secondPlayer.hand))
      .shift();
    cardsThrown += 1;
    console.log(secondPlayer.currentCard);

    lastWinner = winningCard(lastWinner, secondPlayer); //Pobjednik ostaje
    Game.lastPlayer = secondPlayer;
  }
  console.log("Pobjednicka karta je: ", lastWinner.currentCard);

  nextTurn(gameNumber, setGameNumber, lastWinner);
}

function winningCard(player1, player2) {
  const { currentCard: player1Card } = player1;
  const { currentCard: player2Card } = player2;

  if (player1Card.suit === Game.winningSuit) {
    if (player2Card.suit !== player1Card.suit) {
      return player1;
    }
    if (CARD_VALUE_MAP[player1Card.value] > CARD_VALUE_MAP[player2Card.value]) {
      return player1;
    }
    return player2;
  } else if (player2Card.suit === Game.winningSuit) {
    if (player1Card.suit !== player2Card.suit) {
      return player2;
    }
    if (CARD_VALUE_MAP[player2Card.value] > CARD_VALUE_MAP[player1Card.value]) {
      return player2;
    }
    return player1;
  }
}

function nextPlayer(lastPlayer) {
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

function whoPlaysFirst(gameNumber, ...players) {
  if (gameNumber === 0) {
    let firstPlaying = sample(players);
    Game.lastPlayer = firstPlaying;

    return firstPlaying;
  }

  let nextFirstPlayer = Game.lastTurnWinner;
  Game.lastPlayer = nextFirstPlayer;

  return nextFirstPlayer;
}

function nextTurn(gameNumber, setGameNumber, lastWinner) {
  Game.lastTurnWinner = lastWinner;
  setGameNumber(gameNumber + 1);
}
