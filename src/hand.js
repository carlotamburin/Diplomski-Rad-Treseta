export default class Hand {
  constructor(Deck) {
    this.hand = Deck.splice(0, 10);
    this.winner = false;
    this.team = 0;
    this.position = "";
    this.currentCard = {};
    this.typeOfPlayer = "";
  }

  // playCard(playerCard) {
  //   for (const card of this.hand) {
  //     if (card.suit === playerCard.suit && card.value === playerCard.value) {
  //       let playedCard = this.hand.splice(this.hand.indexOf(card), 1);
  //       return playedCard; //shift?
  //     }
  //   }
  // }

  playCard(playerCard, setPlayer) {
    let newArray = [];
    let playedCard = this.hand.filter((card) => {
      if (card.suit === playerCard.suit && card.value === playerCard.value) {
        return card; //shift?
      } else {
        newArray.push(card);
      }
    });

    setPlayer((prevState) => {
      let player = Object.assign(prevState, prevState);
      player.hand = newArray;

      return player;
    });
    return playedCard.shift();
  }
}
