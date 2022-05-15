import React from "react";
import { useEffect, useState, useRef, useContext } from "react";
import { UserContext } from "./App.js";

//dinari
import { ReactComponent as CardDACE } from "./Cards/clubs_ace.svg";
import { ReactComponent as CardD2 } from "./Cards/clubs_2.svg";
import { ReactComponent as CardD3 } from "./Cards/clubs_3.svg";
import { ReactComponent as CardD4 } from "./Cards/clubs_4.svg";
import { ReactComponent as CardD5 } from "./Cards/clubs_5.svg";
import { ReactComponent as CardD6 } from "./Cards/clubs_6.svg";
import { ReactComponent as CardD7 } from "./Cards/clubs_7.svg";
import { ReactComponent as CardDJK } from "./Cards/clubs_jack.svg";
import { ReactComponent as CardDKN } from "./Cards/clubs_queen.svg";
import { ReactComponent as CardDKG } from "./Cards/clubs_king.svg";

//Bastoni
import { ReactComponent as CardBACE } from "./Cards/diamonds_ace.svg";
import { ReactComponent as CardB2 } from "./Cards/diamonds_2.svg";
import { ReactComponent as CardB3 } from "./Cards/diamonds_3.svg";
import { ReactComponent as CardB4 } from "./Cards/diamonds_4.svg";
import { ReactComponent as CardB5 } from "./Cards/diamonds_5.svg";
import { ReactComponent as CardB6 } from "./Cards/diamonds_6.svg";
import { ReactComponent as CardB7 } from "./Cards/diamonds_7.svg";
import { ReactComponent as CardBJK } from "./Cards/diamonds_jack.svg";
import { ReactComponent as CardBKN } from "./Cards/diamonds_queen.svg";
import { ReactComponent as CardBKG } from "./Cards/diamonds_king.svg";
//Kope
import { ReactComponent as CardKACE } from "./Cards/hearts_ace.svg";
import { ReactComponent as CardK2 } from "./Cards/hearts_2.svg";
import { ReactComponent as CardK3 } from "./Cards/hearts_3.svg";
import { ReactComponent as CardK4 } from "./Cards/hearts_4.svg";
import { ReactComponent as CardK5 } from "./Cards/hearts_5.svg";
import { ReactComponent as CardK6 } from "./Cards/hearts_6.svg";
import { ReactComponent as CardK7 } from "./Cards/hearts_7.svg";
import { ReactComponent as CardKJK } from "./Cards/hearts_jack.svg";
import { ReactComponent as CardKKN } from "./Cards/hearts_queen.svg";
import { ReactComponent as CardKKG } from "./Cards/hearts_king.svg";
//Spade
import { ReactComponent as CardSACE } from "./Cards/spades_ace.svg";
import { ReactComponent as CardS2 } from "./Cards/spades_2.svg";
import { ReactComponent as CardS3 } from "./Cards/spades_3.svg";
import { ReactComponent as CardS4 } from "./Cards/spades_4.svg";
import { ReactComponent as CardS5 } from "./Cards/spades_5.svg";
import { ReactComponent as CardS6 } from "./Cards/spades_6.svg";
import { ReactComponent as CardS7 } from "./Cards/spades_7.svg";
import { ReactComponent as CardSJK } from "./Cards/spades_jack.svg";
import { ReactComponent as CardSKN } from "./Cards/spades_queen.svg";
import { ReactComponent as CardSKG } from "./Cards/spades_king.svg";

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
};

export function MapImageToCard(props) {
  return (
    <div className="playingCards rotateHand">
      {/* {console.log(Object.keys(props))} */}
      {Object.keys(props).map((hand, index) => (
        <CreateCardImage
          Hand={props[hand]}
          playerNumber={index + 1}
          key={index + 1}
        />
      ))}
    </div>
  );
}

export function CreateCardImage({ Hand, playerNumber }) {
  let { value } = useContext(UserContext);
  let isClicked = value[0];
  let Clicked = value[1];

  let playerNumberforClass = "hand" + playerNumber;

  const cardRef = useRef();

  const onCardClick = () => {
    let cardClassName = cardRef.current.className.baseVal.split(" ")[0];
    if (cardClassName === "cardH4") {Clicked(true);
    console.log("Player played a card")
    }
    

  };

  return (
    <ul id="hand" className={playerNumberforClass}>
      {Hand.map((Card, index) => {
        let cardName = "Card" + Card.suit + Card.value;
        let Cards = svgImages[cardName];
        return (
          <Cards
            className={["cardH" + playerNumber, "card"].join(" ")}
            key={index + 1}
            onClick={() => {
              onCardClick();
            }}
            ref={cardRef}
          />
        );
      })}
    </ul>
  );
}
