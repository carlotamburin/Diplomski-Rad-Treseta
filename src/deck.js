import shuffle from "lodash/shuffle";
export const SUITS = ["D", "B", "K", "S"];
export const VALUES = ["ACE", "2", "3", "4", "5", "6", "7", "JK", "KN", "KG"];

export class Deck {
  constructor(cards = freshDeck()) {
    this.cards = cards;
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
