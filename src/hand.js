export default class Hand {
  constructor(Deck) {
    this.hand = Deck.splice(0, 10);
    this.winner = false;
    this.team = 0;
    this.position = "";
    this.currentCard = {};
    this.typeOfPlayer = "";
    this.setted = false;
  }

  playCard(playerCard, setPlayer) {
    let newArray = [];
    let playedCard = this.hand.filter((card) => {
      if (card.suit === playerCard.suit && card.value === playerCard.value) {
        return card;
      } else {
        newArray.push(card);
      }
    });

    setPlayer((prevState) => {
      let [card] = playedCard;
      let player = Object.assign(prevState, prevState);
      player.hand = newArray;
      player.currentCard = card

      return player;
    });
    return playedCard[0];
  }

  cardsInHand() {
    return this.hand.length;
  }
}
