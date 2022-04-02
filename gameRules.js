import SUITS from "./deck.js";
import VALUES from "./deck.js";
import sample from "./lodash/sample.js";
import shuffle from "./lodash/shuffle.js";
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
    //console.log(players[i].position + ":" + players[i].team);
  }
}

function lastTurnWinner(player1, player2, player3, player4) {
  player1.winner = true; // za sad je hardcodano
  let lastTurnWinner = {};
  for (let i = 0; i < arguments.length; i++) {
    const player = arguments[i];
    if (player.winner) {
      lastTurnWinner = Game.lastPlayer = player;
      return lastTurnWinner;
    }
  }
}

export function playTurn(player1, player2, player3, player4) {
  let cardsThrown = 0;
  let lastWinner = lastTurnWinner(...arguments);

  const { hand: player1Hand } = player1;
  const { hand: player2Hand } = player2;
  const { hand: player3Hand } = player3;
  const { hand: player4Hand } = player4;
  const { hand: lastTurnWinnerHand } = lastWinner;

  lastWinner.currentCard = lastWinner
    .playCard(sample(lastTurnWinnerHand))
    .shift();
  player2.currentCard = player2.playCard(sample(player2Hand)).shift();

  //while petlja
  nextPlayer(Game.lastPlayer);
  //winningCard(lastWinner, player2); //Pobjednik ostaje
}

function winningCard(player1, player2) {
  const { currentCard: player1Card } = player1;
  const { currentCard: player2Card } = player2;

  if (player1Card.suit == Game.winningSuit) {
    if (player2Card.suit != player1Card.suit) {
      return player1;
    }
    if (CARD_VALUE_MAP[player1Card.value] > CARD_VALUE_MAP[player2Card.value]) {
      return player1;
    }
    return player2;
  } else if (player2Card.suit == Game.winningSuit) {
    if (player1Card.suit != player2Card.suit) {
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

  console.log("The next player position " + val);
  console.log("The next player team: " + TABLE_POSITION[val]);
  console.log("The last player position " + indexOfLastPLayer);

  
}
