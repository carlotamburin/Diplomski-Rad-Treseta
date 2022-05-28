import sample from "lodash/sample.js";
import shuffle from "lodash/shuffle.js";
import Game from "./gameTrack.js";
import { CLICK } from "./CardImages.js";

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
  lastWinner,
  secondPlayer,
  setsecondPlayer,
  cardsPlayed,
  setcardsPlayed,
  gameNumber,
  setGameNumber,
  playerPlayed,
  setPlayerPlayed
) {
  const { hand: lastTurnWinnerHand } = lastWinner;

  if (cardsPlayed === 0) {
    if (isPlayerTurn(lastWinner)) {
      await waitUserClick(playerPlayed, setPlayerPlayed);
      setcardsPlayed(cardsPlayed + 1);
      console.log("Waiting for player");
    } else {
      lastWinner.currentCard = lastWinner
        .playCard(sample(lastTurnWinnerHand))
        .shift();
      setcardsPlayed(cardsPlayed + 1);

      console.log("PLayer played a card:", lastWinner);
    }
    Game.winningSuit = lastWinner.currentCard.suit;
    Game.lastPlayer = lastWinner;
  }
  //While
  else {
    if (isPlayerTurn(secondPlayer)) {
      await waitUserClick(playerPlayed, setPlayerPlayed);
      setcardsPlayed(cardsPlayed + 1);
      console.log("Waiting for player");
    } else {
      secondPlayer.currentCard = secondPlayer
        .playCard(sample(secondPlayer.hand))
        .shift();
      setcardsPlayed(cardsPlayed + 1);

      console.log("PLayer played a card:", secondPlayer);
    }
  }
  Game.lastPlayer = lastWinner; 
}

export function winningCard(player1, player2) {
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

export function whoPlaysFirst(gameNumber, ...players) {
  if (gameNumber === 0) {
    let firstPlaying = sample(players);
    Game.lastPlayer = firstPlaying;

    return firstPlaying;
  }

  let nextFirstPlayer = Game.lastTurnWinner;
  Game.lastPlayer = nextFirstPlayer;

  return nextFirstPlayer;
}

export function nextTurn(gameNumber, setGameNumber, lastWinner) {
  Game.lastTurnWinner = lastWinner;
  console.log("U kraju sam");
  setGameNumber(gameNumber + 1);
}

async function waitUserClick(playerPlayed, setPlayerPlayed) {
  var promise = new Promise((resolve, reject) => {
    if (playerPlayed === true) {
      resolve("Kliknuo si");
    }
    //CLICK.once("clicked", resolve);
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
