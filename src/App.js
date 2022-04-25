import Deck from "./deck.js";
import Hand from "./hand.js";
import { takeSeat, playTurn } from "./gameRules.js";
import {CreateCardImage} from "./deck.js";

function App() {
  const deck = new Deck();
  deck.shuffler();
  const player1 = new Hand(deck.cards);
  const player2 = new Hand(deck.cards);
  const player3 = new Hand(deck.cards);
  const player4 = new Hand(deck.cards);

  takeSeat(player1, player2, player3, player4);
  CreateCardImage(deck);
  //player1.playCard(player1.hand[1])

  // tu ide petlja
  playTurn(player1, player2, player3, player4);

}

export default App;
