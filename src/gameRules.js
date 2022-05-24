import sample from "lodash/sample.js";
import shuffle from "lodash/shuffle.js";
import { useEffect, useRef } from "react";
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
  gameNumber,
  setGameNumber,
  playerPlayed,
  setPlayerPlayed,
  ...players
) {
  let cardsThrown = 0;
  let lastWinner = whoPlaysFirst(gameNumber, ...players);
<<<<<<< HEAD
=======



  let { value } = useContext(UserContext);
  let isClicked = value[0];
  let Clicked = value[1];

  await WaitForUserClick(isClicked, Clicked);

>>>>>>> 23c8bd7d937aea11bf04e0d2060ec00d520d39d7
  const { hand: lastTurnWinnerHand } = lastWinner;
  console.log(lastWinner);

  if (isPlayerTurn(lastWinner))
    await waitUserClick(playerPlayed, setPlayerPlayed);
  else {
    lastWinner.currentCard = lastWinner
      .playCard(sample(lastTurnWinnerHand))
      .shift();
    console.log("PLayer played a card:", lastWinner);
  }

  Game.winningSuit = lastWinner.currentCard.suit;
  cardsThrown += 1;

  while (cardsThrown !== 4) {
    let secondPlayer = nextPlayer(Game.lastPlayer);
<<<<<<< HEAD
    if (isPlayerTurn(secondPlayer))
      await waitUserClick(playerPlayed, setPlayerPlayed);
    else {
      secondPlayer.currentCard = secondPlayer
        .playCard(sample(secondPlayer.hand))
        .shift();
      console.log("PLayer played a card:", secondPlayer);
    }
=======

    //console.log("Second player je " + JSON.stringify(secondPlayer));

    secondPlayer.currentCard = secondPlayer
      .playCard(sample(secondPlayer.hand))
      .shift();
>>>>>>> 23c8bd7d937aea11bf04e0d2060ec00d520d39d7
    cardsThrown += 1;
    console.log(cardsThrown);

    lastWinner = winningCard(lastWinner, secondPlayer); //Pobjednik ostaje
    Game.lastPlayer = secondPlayer;
  }
  console.log("Pobjednicka karta je: ", lastWinner.currentCard);

  nextTurn(lastWinner, ...players);
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

function whoPlaysFirst(...players) {
  if (Game.gameNumber === 0) {
    let firstPlaying = sample(players);
    firstPlaying.winner = true;
    Game.whoPlayedFirst = firstPlaying;
  }
  let nextFirstPlayer = nextPlayer(Game.whoPlayedFirst);
  nextFirstPlayer.winner = true;
  Game.whoPlayedFirst = nextFirstPlayer;
}

<<<<<<< HEAD
function nextTurn(gameNumber, setGameNumber, lastWinner) {
  Game.lastTurnWinner = lastWinner;
  console.log("U kraju sam");
  setGameNumber(gameNumber + 1);
=======
function nextTurn(lastWinner, ...players) {
  for (const player of players) {
    if (player !== lastWinner) player.winner = false;
  }
  Game.gameNumber += 1;
>>>>>>> 23c8bd7d937aea11bf04e0d2060ec00d520d39d7
}

async function waitUserClick(playerPlayed, setPlayerPlayed) {
  var promise = new Promise((resolve, reject) => {
    if (playerPlayed === true) {
      resolve("Kliknuo si");
    }
  });
  await promise
    .then((result) => {
      console.log("Vrijednost isClicked je:" + playerPlayed);
      setPlayerPlayed(false);
    })
    .catch(() => {
      console.log("ERROR");
    });
}

function isPlayerTurn(player) {
  if (player.typeOfPlayer === "human") return true;
  else return false;
}
