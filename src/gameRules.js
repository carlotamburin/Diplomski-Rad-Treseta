import sample from "lodash/sample.js";
import shuffle from "lodash/shuffle.js";
import Game from "./gameTrack.js";
import { EE } from "./CardImages.js";

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
  lastWinnerCurrCard,
  setLastWinnerCurrCard,
  secondPlayerCurrentCard,
  setsecondPlayerCurrentCard,
  lastPlayer,
  setLastPlayer,
  winningSuit,
  setWiningSuit,
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
  console.log("Usao u playCard");

  if (cardsPlayed === 0) {
    if (isPlayerTurn(lastWinner)) {
      let clickedCard = await waitUserClick(playerPlayed);
      console.log(clickedCard);
      setcardsPlayed(cardsPlayed + 1);
      setPlayerPlayed(false);
    } else {
      setLastWinnerCurrCard(
        lastWinner.playCard(sample(lastTurnWinnerHand)).shift()
      );
      setcardsPlayed(cardsPlayed + 1);
      console.log("Last player: played a card:", lastWinner);
    }
    console.log(lastWinner.currentCard);
    setWiningSuit(lastWinner.currentCard.suit);
    setLastPlayer(lastWinner);
  }
  //While
  else {
    if (isPlayerTurn(secondPlayer)) {
      let clickedCard = await waitUserClick(playerPlayed);
      console.log(clickedCard);

      setcardsPlayed(cardsPlayed + 1);
      setPlayerPlayed(false);
      console.log("Waiting for second player");
    } else {
      setsecondPlayerCurrentCard(
        secondPlayer.playCard(sample(secondPlayer.hand)).shift()
      );
      setcardsPlayed(cardsPlayed + 1);
      console.log("Second player: played a card:", secondPlayer);
    }
    setLastPlayer(secondPlayer);
  }
}

export function winningCard(player1, player2, winningSuit) {
  const { currentCard: player1Card } = player1;
  const { currentCard: player2Card } = player2;

  if (player1Card.suit === winningSuit) {
    //Popravi ove class variable
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

export function whoPlaysFirst(
  gameNumber,
  lastWinner,
  setlastPlayer,
  ...players
) {
  let nextFirstPlayer = lastWinner;
  setlastPlayer(nextFirstPlayer);

  return nextFirstPlayer;
}

export function whoPlaysFirstDefault(player1, player2, player3, player4) {
  let players = [player1, player2, player3, player4];
  let firstPlaying = sample(players);

  return firstPlaying;
}

export function nextTurn(
  gameNumber,
  setGameNumber,
  lastWinner,
  setcardsPlayed
) {
  setcardsPlayed(0);
  console.log("U kraju sam");
  setGameNumber(gameNumber + 1);
}

async function waitUserClick(playerPlayed) {
  return await new Promise((resolve, reject) => {
    if (playerPlayed === true) {
      EE.on("click", function listener(arg) {
        console.log(arg);
        resolve(arg);
      });
    }
  });
  //await promise
}

function isPlayerTurn(player) {
  if (player.typeOfPlayer === "human") return true;
  else return false;
}

// function playCard(player,type,setCard){

//   if(type === "AI"){
//     setCard(
//       player.playCard(sample(player.hand)).shift()
//     );
//   }

// }
