import Deck from "./deck.js";
import sample from "./lodash/sample.js";
import shuffle from "./lodash/shuffle.js";



export default class Hand {
  constructor(Deck) {
    this.hand = Deck.splice(0, 10);
    this.winner = false;
    this.team = 0
    this.position = ""
    this.currentCard = {};
    this.playerType=""
  }

  drawCard(Deck) {
    this.hand = this.hand.concat(Deck.splice(0, 1));
  }

  playCard(playerCard) {
    for (const card of this.hand) {
      if (card.suit == playerCard.suit && card.value == playerCard.value) {
        const playerCard = this.hand.splice(this.hand.indexOf(card), 1);
        return playerCard; //shift?
      }
    }
  }
}
