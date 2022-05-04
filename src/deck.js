import shuffle from "lodash/shuffle";
import React from "react";
export const SUITS = ["D", "B", "K", "S"];
export const VALUES = ["ACE", "2", "3", "4", "5", "6", "7", "JK", "KN", "KG"];

export class Deck {
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
  constructor(suit, value, image) {
    this.suit = suit;
    this.value = value;
    this.image = image;
  }
}

function freshDeck() {
  return SUITS.flatMap((suit) => {
    //funkcionira kao ugnježđena for petlja
    return VALUES.map((value) => {
      return new Card(suit, value, "");
    });
  });
}

