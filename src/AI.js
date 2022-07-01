import { maxBy, minBy } from "lodash";
import { CARD_VALUE_MAP } from "./gameRules";
import { ONLY_POINTS } from "./gameRules";

export function playCardAI(
  player,
  myHand,
  cardsPlayed,
  cardsInPlay,
  winningCard,
  partnerCard,
  gameStats,
  isFirstPlayer
) {
  let cardToPlay;
  let suit;
  // Kada odgovaram na prijateljev tucem

  cardToPlay = winAce(myHand, cardsInPlay, winningCard, partnerCard, gameStats);
  console.log("🚀 ~ file: AI.js ~ line 19 ~ player", player.position);

  if (cardToPlay) {
    console.log("🚀 ~ file: AI.js ~ line 22 ~ cardToPlay", cardToPlay);
    return cardToPlay;
  }

  cardToPlay = ifKnocking(player, gameStats, myHand, partnerCard);
  if (cardToPlay) {
    console.log("🚀 ~ file: AI.js ~ line 28 ~ cardToPlay", cardToPlay);

    return cardToPlay;
  }

  // console.log("Result for is knocking", responseToKnocking);
  // console.log(gameStats.current.turnNumber);
  // console.log("Result for is isKnockingTeam1", gameStats.current.team1Knocking);
  // console.log("Result for is isKnockingTeam2", gameStats.current.team2Knocking);

  // Kada tucem
  if (isFirstPlayer.current && gameStats.current.turnNumber !== 0) {
    cardToPlay = knocking(myHand, player, gameStats);
  }
  if (cardToPlay) {
    console.log("🚀 ~ file: AI.js ~ line 43 ~ cardToPlay", cardToPlay);
    return cardToPlay;
  }

  cardToPlay = winOnlys(cardsInPlay, myHand, winningCard); // Ove istestirati
  if (cardToPlay) {
    console.log("🚀 ~ file: AI.js ~ line 49 ~ cardToPlay", cardToPlay);
    return cardToPlay;
  }

  // Kada ne igra prvi
  if (!isFirstPlayer.current) {
    cardToPlay = lowestCardOfSpecificSuit(winningCard.suit, myHand);
    if (typeof cardToPlay !== "object")
      cardToPlay = lowestCardOfSpecificSuit(cardToPlay, myHand);
    if (cardToPlay) {
      return cardToPlay;
    }

    console.log(cardToPlay);
  }

  // kad igra prvi
  if (isFirstPlayer.current) {
    suit = numberOfSuitsInHand(myHand);
    cardToPlay = lowestCardOfSpecificSuit(suit, myHand);
    if (typeof cardToPlay !== "object")
      cardToPlay = lowestCardOfSpecificSuit(cardToPlay, myHand);
    if (cardToPlay) {
      return cardToPlay;
    }
  }

  console.log("AI nije pronasao rjesenje");
  return 0;
}

function ifKnocking(player, gameStats, myHand, partnerCard) {
  let matchingSuitCards = [];
  let strongestCard = {};
  let bestAlternativeSuit;

  if (player.team === 1) {
    if (gameStats.current.team1Knocking === true) {
      for (let i = 0; i < myHand.length; i++) {
        const card = myHand[i];
        if (card.suit === partnerCard.suit) matchingSuitCards.push(card);
      }
      if (!matchingSuitCards) {
        bestAlternativeSuit = numberOfSuitsInHand(myHand);
        lowestCardOfSpecificSuit(bestAlternativeSuit, myHand);
      }
      strongestCard = matchingSuitCards[0];
      for (let i = 0; i < matchingSuitCards.length; i++) {
        const card = matchingSuitCards[i];
        if (CARD_VALUE_MAP[card.value] > CARD_VALUE_MAP[strongestCard.value])
          strongestCard = card;
      }
      if (strongestCard > partnerCard) {
        gameStats.current.team1Knocking = false;
      }
      return strongestCard;
    }
  }

  if (player.team === 2) {
    if (gameStats.current.team2nocking === true) {
      for (let i = 0; i < myHand.length; i++) {
        const card = myHand[i];
        if (card.suit === partnerCard.suit) matchingSuitCards.push(card);
      }
      if (!matchingSuitCards) {
        bestAlternativeSuit = numberOfSuitsInHand(myHand);
        strongestCard = lowestCardOfSpecificSuit(bestAlternativeSuit, myHand);
      }
      strongestCard = matchingSuitCards[0];
      for (let i = 0; i < matchingSuitCards.length; i++) {
        const card = matchingSuitCards[i];
        if (CARD_VALUE_MAP[card.value] > CARD_VALUE_MAP[strongestCard.value])
          strongestCard = card;
      }

      if (strongestCard > partnerCard) {
        gameStats.current.team2Knocking = false;
      }

      return strongestCard;
    }
  }

  return 0;
}

function knocking(myHand, player, gameStats) {
  if (gameStats.current.team1Knocked && gameStats.current.team2Knocked)
    return 0;

  console.log("U KNOCKINGU SAM");
  const numberOfFollowUpCardsPerSuit = numberOfSameSuitsInHand(myHand);
  let strongCardsInParticularSuit = { K: [], D: [], B: [], S: [] };

  let maxLenght =
    strongCardsInParticularSuit[Object.keys(strongCardsInParticularSuit)[0]]
      .length;
  let maxLenghtSuit = Object.keys(strongCardsInParticularSuit)[0];

  let maxFollowUpCards = Object.keys(numberOfFollowUpCardsPerSuit)[0];

  let strongestCardsAvailable = [];

  console.log("Usao u knocking funkciju");
  if (player.team === 1) {
    if (gameStats.current.team1Knocking === true) {
      if (gameStats.current.cardsInQue[player.position] === []) {
        gameStats.current.team1Knocking = false;
        gameStats.current.team1Knocked = true;
      }
      return gameStats.current.cardsInQue[player.position].pop();
    }
  }

  if (player.team === 2) {
    if (gameStats.current.team2Knocking === true) {
      if (gameStats.current.cardsInQue[player.position] === []) {
        gameStats.current.team2Knocking = false;
        gameStats.current.team2Knocked = true;
      }
      return gameStats.current.cardsInQue[player.position].pop();
    }
  }

  //Gledaj jeli ima 3,2,1 i pushaj u odgovarajuci suit u strongCardsInParticularSuit
  for (let i = 0; i < myHand.length; i++) {
    const card = myHand[i];
    if (["3", "2", "ACE"].includes(card.value)) {
      for (const suit in strongCardsInParticularSuit) {
        if (suit === card.suit) strongCardsInParticularSuit[suit].push(card);
      }
    }
  }

  console.log(numberOfFollowUpCardsPerSuit);
  // Gledaj jeli svaki suit sadrzi bar 3 ili 2
  for (const suit in strongCardsInParticularSuit) {
    if (
      strongCardsInParticularSuit[suit].length > maxLenght &&
      strongCardsInParticularSuit[suit].some((card) => card.value === "3") !==
        strongCardsInParticularSuit[suit].some((card) => card.value === "2") &&
      !strongCardsInParticularSuit[suit].some((card) => card.value === "ACE")
    ) {
      maxLenght = strongCardsInParticularSuit[suit].length;
      maxLenghtSuit = suit;
    } else if (
      strongCardsInParticularSuit[suit].length === maxLenght &&
      strongCardsInParticularSuit[suit].some((card) => card.value === "3") !==
        strongCardsInParticularSuit[suit].some((card) => card.value === "2") &&
      !strongCardsInParticularSuit[suit].some((card) => card.value === "ACE")
    ) {
      if (
        numberOfFollowUpCardsPerSuit[suit] >=
        numberOfFollowUpCardsPerSuit[maxFollowUpCards]
      ) {
        maxLenghtSuit = suit;
      }
    }
  }

  console.log(strongCardsInParticularSuit);

  strongestCardsAvailable = strongCardsInParticularSuit[maxLenghtSuit];

  console.log(strongestCardsAvailable);

  if (strongestCardsAvailable.length >= 1) {
    gameStats.current.cardsInQue[player.position].push(
      ...strongestCardsAvailable
    );
    console.log(gameStats.current.cardsInQue);
    console.log(player.position);
    if (player.team === 1) gameStats.current.team1Knocking = true;
    else gameStats.current.team2Knocking = true;

    return gameStats.current.cardsInQue[player.position].pop();
  }

  return 0;
}

function doIHaveThisCard(myHand, card) {
  for (const myCard of myHand) {
    if (myCard.value === card.value && myCard.suit === card.suit) return true;
  }

  return false;
}

function numberOfSameSuitsInHand(myHand) {
  let numOfSameSuits = { K: 0, D: 0, B: 0, S: 0 };

  for (let i = 0; i < myHand.length; i++) {
    const card = myHand[i];
    numOfSameSuits[card.suit] = numOfSameSuits[card.suit] + 1 || 1;
  }

  return numOfSameSuits;
}

function isCardinPlay(checkingCard, thisTurnCards) {
  for (const card of thisTurnCards.current) {
    if (checkingCard.suit === card.suit && checkingCard.value === card.value)
      return true;
  }
  return false;
}

function wasAceOfThisSuitPlayed(suit, gameStats) {
  for (const card of gameStats.current.team1CardsWon) {
    if (card.value === "ACE" && card.suit === suit) return true;
  }
  for (const card of gameStats.current.team2CardsWon) {
    if (card.value === "ACE" && card.suit === suit) return true;
  }

  return false;
}

function was3OfThisSuitPlayed(suit, gameStats) {
  for (const card of gameStats.current.team1CardsWon) {
    if (card.value === "3" && card.suit === suit) return true;
  }
  for (const card of gameStats.current.team2CardsWon) {
    if (card.value === "3" && card.suit === suit) return true;
  }

  return false;
}

function was2OfThisSuitPlayed(suit, gameStats) {
  for (const card of gameStats.current.team1CardsWon) {
    if (card.value === "2" && card.suit === suit) return true;
  }
  for (const card of gameStats.current.team2CardsWon) {
    if (card.value === "2" && card.suit === suit) return true;
  }

  return false;
}

function winAce(myHand, thisTurnCards, winningCard, partnerCard, gameStats) {
  let bestCard;

  let winningCards = winningCardsATM(myHand, winningCard);

  for (const card of thisTurnCards.current) {
    if (card.value === "ACE" && card !== partnerCard) {
      if (card.suit === winningCard.suit) {
        if (
          isCardinPlay({ suit: winningCard.suit, value: "3" }, thisTurnCards) // Dodaj jeli parnerova trica i onda mu daj asha nekog ko nemas tog suita
        ) {
          bestCard = lowestCardOfSpecificSuit(winningCard.suit, myHand);
          if (typeof bestCard !== "object") {
            return lowestCardOfSpecificSuit(bestCard, myHand);
          } else return bestCard;
        }
        if (
          isCardinPlay({ suit: winningCard.suit, value: "2" }, thisTurnCards)
        ) {
          if (
            isParnerCard({ suit: winningCard.suit, value: "2" }, partnerCard)
          ) {
            if (was3OfThisSuitPlayed(winningCard.suit, gameStats)) {
              bestCard = lowestCardOfSpecificSuit(winningCard.suit, myHand);
              if (typeof bestCard !== "object") {
                return lowestCardOfSpecificSuit(bestCard, myHand);
              } else return bestCard;
            } else if (
              doIHaveThisCard(myHand, { suit: winningCard.suit, value: "3" })
            ) {
              bestCard = lowestCardOfSpecificSuit(winningCard.suit, myHand);
              if (typeof bestCard !== "object") {
                return lowestCardOfSpecificSuit(bestCard, myHand);
              } else return bestCard;
            }
          } else {
            if (was3OfThisSuitPlayed(winningCard.suit, gameStats)) {
              bestCard = lowestCardOfSpecificSuit(winningCard.suit, myHand);
              if (typeof bestCard !== "object") {
                return lowestCardOfSpecificSuit(bestCard, myHand);
              } else return bestCard;
            } else if (
              doIHaveThisCard(myHand, { suit: winningCard.suit, value: "3" })
            ) {
              return (bestCard = findSpecificCard(
                myHand,
                winningCard.suit,
                "3"
              ));
            } else {
              bestCard = lowestCardOfSpecificSuit(winningCard.suit, myHand);
              if (typeof bestCard !== "object") {
                return lowestCardOfSpecificSuit(bestCard, myHand);
              } else return bestCard;
            }
          }
        } else {
          if (doIHaveThisCard(myHand, { suit: winningCard.suit, value: "2" })) {
            return (bestCard = findSpecificCard(myHand, winningCard.suit, "2"));
          }
          if (was2OfThisSuitPlayed(winningCard.suit, gameStats)) {
            bestCard = highestCardOfSpecificSuit(winningCard.suit, myHand);
            if (typeof bestCard !== "object") {
              return lowestCardOfSpecificSuit(bestCard, myHand);
            } else return bestCard;
          } else {
            bestCard = lowestCardOfSpecificSuit(winningCard.suit, myHand);
            if (typeof bestCard !== "object") {
              return lowestCardOfSpecificSuit(bestCard, myHand);
            } else return bestCard;
          }
        }
      } else {
        return (bestCard = highestCardOfSpecificSuit(winningCard.suit, myHand));
      }
    } else if (card.value === "ACE" && card === partnerCard) {
      if (card.suit === winningCard.suit) {
        if (
          isCardinPlay({ suit: winningCard.suit, value: "3" }, thisTurnCards)
        ) {
          bestCard = lowestCardOfSpecificSuit(winningCard.suit, myHand);
          if (typeof bestCard !== "object") {
            return lowestCardOfSpecificSuit(bestCard, myHand);
          } else return bestCard;
        }

        if (
          isCardinPlay({ suit: winningCard.suit, value: "2" }, thisTurnCards)
        ) {
          if (was3OfThisSuitPlayed(winningCard.suit, gameStats)) {
            bestCard = lowestCardOfSpecificSuit(winningCard.suit, myHand);
            if (typeof bestCard !== "object") {
              return lowestCardOfSpecificSuit(bestCard, myHand);
            } else return bestCard;
          } else if (
            doIHaveThisCard(myHand, { suit: winningCard.suit, value: "3" })
          ) {
            bestCard = highestCardOfSpecificSuit(winningCard.suit, myHand);
            if (typeof bestCard !== "object") {
              return lowestCardOfSpecificSuit(bestCard, myHand);
            } else return bestCard;
          } else {
            bestCard = lowestCardOfSpecificSuit(winningCard.suit, myHand);
            if (typeof bestCard !== "object") {
              return lowestCardOfSpecificSuit(bestCard, myHand);
            } else return bestCard;
          }
        }
      } else {
        return highestCardOfSpecificSuit(winningCard.suit, myHand);
      }
    }
  }

  return 0;
}

function winningCardsATM(myHand, winningCard) {
  let winningCards = [];
  for (const myCard of myHand) {
    if (
      myCard.suit === winningCard.suit &&
      CARD_VALUE_MAP[myCard.value] > CARD_VALUE_MAP[winningCard.value]
    ) {
      winningCards.push(myCard);
    }
  }

  return winningCards;
}

function winOnlys(thisTurnCards, myHand, winningCard) {
  let onlycounter = 0;
  let winningCards = [];
  let bestCard;
  for (const card of thisTurnCards.current) {
    if (ONLY_POINTS.includes(card.value)) {
      onlycounter += 1;
    }
  }

  if (onlycounter >= 2) {
    winningCards = winningCardsATM(myHand, winningCard);
  }

  bestCard = minBy(winningCards, (card) => {
    return CARD_VALUE_MAP[card.value];
  });

  return bestCard;
}

function lowestWinningCard(winningCards) {
  let bestCard = minBy(winningCards, (card) => {
    return CARD_VALUE_MAP[card.value];
  });
  return bestCard;
}

function highestWinningCard(winningCards) {
  let bestCard = maxBy(winningCards, (card) => {
    return CARD_VALUE_MAP[card.value];
  });
  return bestCard;
}

function lowestCardOfSpecificSuit(suit, myHand) {
  let matchihSuitCards = [];

  for (const card of myHand) {
    if (card.suit === suit) matchihSuitCards.push(card);
  }

  console.log(matchihSuitCards);

  if (matchihSuitCards.length === 0) return numberOfSuitsInHand(myHand);

  return lowestWinningCard(matchihSuitCards);
}

function highestCardOfSpecificSuit(suit, myHand) {
  let matchihSuitCards = [];

  for (const card of myHand) {
    if (card.suit === suit) matchihSuitCards.push(card);
  }

  if (matchihSuitCards.length === 0) return numberOfSuitsInHand(myHand);

  return highestWinningCard(matchihSuitCards);
}

function isParnerCard(card, partnerCard) {
  if (card.value === partnerCard.value && card.suit === partnerCard.suit)
    return true;
  return false;
}

function numberOfSuitsInHand(myHand) {
  let numberofSuits = numberOfSameSuitsInHand(myHand);
  let maxFollowUpCards = Object.keys(numberofSuits)[0];

  console.log(numberofSuits);

  for (const suit in numberofSuits) {
    if (numberofSuits[suit] >= numberofSuits[maxFollowUpCards]) {
      maxFollowUpCards = suit;
    }
  }

  console.log("Returnam", maxFollowUpCards);
  return maxFollowUpCards;
}

function findSpecificCard(myHand, suit, value) {
  for (const card of myHand) {
    if (card.value === value && card.suit === suit) return card;
  }
}

function scrichio() {}

function ifStrichio() {}

function winTurnForleadingNextOne() {}
