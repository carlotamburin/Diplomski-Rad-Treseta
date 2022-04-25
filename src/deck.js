import shuffle from "lodash/shuffle";
import { useState } from "react";
export const SUITS = ["D", "B", "K", "S"];
export const VALUES = ["ACE", "2", "3", "4", "5", "6", "7", "JK", "KN", "KG"];

export default class Deck {
  constructor(cards = freshDeck()) {
    this.cards = cards;
  }

  numberOrCards() {
    return this.cards.length;
  }

  shuffler() {
    this.cards = shuffle(this.cards);
  }
}

class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }
}

function freshDeck() {
  return SUITS.flatMap((suit) => {
    //funkcionira kao ugnježđena for petlja
    return VALUES.map((value) => {
      return new Card(suit, value);
    });
  });
}

export function CreateCardImage(hand) {
  return <h1>GAY</h1>;
}
//Export default i vrati kao jsx??

let root = document.querySelector("#board");

let playerHand = document.createElement("ul"); //Imperial flower
playerHand.setAttribute("id", "hand");

let cardList = document.createElement("li"); //card
cardList.setAttribute("id", "card1");

root.appendChild(playerHand);
playerHand.appendChild(cardList);

let cardImg = new Image(250, 100);
cardImg.src = "../public/svg_playing_cards/fronts/clubs_10.svg";

let finalCard = document.querySelector("#card1");
finalCard.appendChild(cardImg);
