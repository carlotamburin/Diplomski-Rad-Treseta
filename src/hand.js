export default class Hand {
  constructor(Deck) {
    this.hand = Deck.splice(0, 10);
    this.winner = false;
    this.team = 0;
    this.position = "";
    this.currentCard = {};
    this.playerType = "";
  }

  playCard(playerCard) {
    for (const card of this.hand) {
      if (card.suit === playerCard.suit && card.value === playerCard.value) {
        const playerCard = this.hand.splice(this.hand.indexOf(card), 1);
        return playerCard; //shift?
      }
    }
  }

  removeCardFromHand(playerCard) {}
}
