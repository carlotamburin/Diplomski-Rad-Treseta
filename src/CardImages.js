import React from "react";
import { useRef } from "react";

import chunk from "lodash/chunk.js";
import EventEmitter from "eventemitter3";

//import {ReactComponent as ReactLogo} from './logo.svg';

//dinari
import CardDACE from "./Cards/dinari/dinarias.png";
import CardD2 from "./Cards/dinari/dinari2.png";
import CardD3 from "./Cards/dinari/dinari3.png";
import CardD4 from "./Cards/dinari/dinari4.png";
import CardD5 from "./Cards/dinari/dinari5.png";
import CardD6 from "./Cards/dinari/dinari6.png";
import CardD7 from "./Cards/dinari/dinari7.png";
import CardDJK from "./Cards/dinari/dinari11.png";
import CardDKN from "./Cards/dinari/dinari12.png";
import CardDKG from "./Cards/dinari/dinari13.png";

//Bastoni
import CardBACE from "./Cards/bastone/bastoneas.png";
import CardB2 from "./Cards/bastone/bastone2.png";
import CardB3 from "./Cards/bastone/bastone3.png";
import CardB4 from "./Cards/bastone/bastone4.png";
import CardB5 from "./Cards/bastone/bastone5.png";
import CardB6 from "./Cards/bastone/bastone6.png";
import CardB7 from "./Cards/bastone/bastone7.png";
import CardBJK from "./Cards/bastone/bastone11.png";
import CardBKN from "./Cards/bastone/bastone12.png";
import CardBKG from "./Cards/bastone/bastone13.png";

//Kope
import CardKACE from "./Cards/kope/kopeas.png";
import CardK2 from "./Cards/kope/kope2.png";
import CardK3 from "./Cards/kope/kope3.png";
import CardK4 from "./Cards/kope/kope4.png";
import CardK5 from "./Cards/kope/kope5.png";
import CardK6 from "./Cards/kope/kope6.png";
import CardK7 from "./Cards/kope/kope7.png";
import CardKJK from "./Cards/kope/kope11.png";
import CardKKN from "./Cards/kope/kope12.png";
import CardKKG from "./Cards/kope/kope13.png";

//Spade
import CardSACE from "./Cards/spade/spadeas.png";
import CardS2 from "./Cards/spade/spade2.png";
import CardS3 from "./Cards/spade/spade3.png";
import CardS4 from "./Cards/spade/spade4.png";
import CardS5 from "./Cards/spade/spade5.png";
import CardS6 from "./Cards/spade/spade6.png";
import CardS7 from "./Cards/spade/spade7.png";
import CardSJK from "./Cards/spade/spade11.png";
import CardSKN from "./Cards/spade/spade12.png";
import CardSKG from "./Cards/spade/spade13.png";

//Background
import Back from "./Cards/back.png";

const svgImages = {
  CardDACE,
  CardD2,
  CardD3,
  CardD4,
  CardD5,
  CardD6,
  CardD7,
  CardDJK,
  CardDKN,
  CardDKG,
  CardBACE,
  CardB2,
  CardB3,
  CardB4,
  CardB5,
  CardB6,
  CardB7,
  CardBJK,
  CardBKN,
  CardBKG,
  CardKACE,
  CardK2,
  CardK3,
  CardK4,
  CardK5,
  CardK6,
  CardK7,
  CardKJK,
  CardKKN,
  CardKKG,
  CardSACE,
  CardS2,
  CardS3,
  CardS4,
  CardS5,
  CardS6,
  CardS7,
  CardSJK,
  CardSKN,
  CardSKG,
  Back,
};

export const EE = new EventEmitter();
export let knocking = false;
export let striscio = false; // Ocu li mu slati reference pa da promini vrijednost??

export function MapImageToCard({ cards, players }) {
  const knockingOnClick = (event) => {
    knocking = true;
  };

  const striscioOnClick = (event) => {
    striscio = true;
  };
  return (
    <>
      <div className="playingCards rotateHand">
        {/* {console.log("Usao u CardImages")} */}
        {Object.keys(players).map((hand, index) => (
          <CreateCardImage
            Hand={players[hand].hand}
            playerNumber={index + 1}
            key={index + 1}
          />
        ))}

        <ul id="hand" className="playedCardsTurn">
          {cards.current !== undefined ? (
            cards.current.map((card, index) => {
              let cardName = "Card" + card.suit + card.value;
              let Cards = svgImages[cardName];
              return (
                <img src={Cards} alt="card" className="card" key={index + 1} />
              );
            })
          ) : (
            <></>
          )}
        </ul>
        <ul className="KnockStricho">
          <button className="KnockAndStriscio" onClick={knockingOnClick}>
            Tučem
          </button>
          <button className="KnockAndStriscio" onClick={striscioOnClick}>
            Strišo
          </button>
        </ul>
      </div>
    </>
  );
}

export function CreateCardImage({ Hand, playerNumber }) {
  const cardRef = useRef([]);

  let playerNumberforClass = "hand" + playerNumber;

  const onCardClick = (event) => {
    console.log(event);
    let cardClassName = event.target.className.split(" ")[0];
    let id = event.target.id;

    //Getting card info
    let chunks = chunk(id, 5);
    let cardNumber = chunks[1].join("");
    let cardSuit = chunks[0][chunks[0].length - 1];

    let cardValues = { suit: cardSuit, value: cardNumber };

    EE.emit("click", cardValues, cardClassName);

    console.log("Player played a card");
  };

  return (
    <>
      <ul id="hand" className={playerNumberforClass}>
        {Hand.map((Card, index) => {
          let cardName = "Card" + Card.suit + Card.value;
          let Cards;
          if (playerNumber !== 4) {
            Cards = Back;
          } else {
            Cards = svgImages[cardName];
          }
          //Cards = svgImages[cardName];
          return (
            <img
              src={Cards}
              alt="card"
              className={["cardH" + playerNumber, "card"].join(" ")}
              id={cardName}
              key={index + 1}
              onClick={onCardClick}
              ref={(element) => cardRef.current.push(element)}
            />
          );
        })}
      </ul>
    </>
  );
}
