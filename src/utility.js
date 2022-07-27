// export function cardHandAngles() {
//   let cards = document.querySelector(".hand4");
//   let w = cards.offsetWidth;
//   let numcards = 10;
//   let totalarc = 117;
//   let angles = Array(numcards)
//     .fill("")
//     .map(
//       (a, i) =>
//         (totalarc / numcards) * (i + 1) -
//         (totalarc / 2 + totalarc / numcards / 2)
//     );

//   let margins = angles.map((a, i) => (w / numcards) * (i + 1));
//   console.log(angles);
//   console.log(margins);
// }

export function makeCardFan() {
  let cards4 = document.querySelector(".hand4").children;
  let cards1 = document.querySelector(".hand1").children;
  let cards3 = document.querySelector(".hand3").children;
  let cards2 = document.querySelector(".hand2").children;

  // let totalarc = 120;
  // let numcards = 10;
  //let angle = 60;

  //  let firstFormula= -angle / 2 + (angle / (numcards + 1)) * i
  // let secondFormula=(totalarc / numcards * (i + 1)) - (totalarc/2 + (totalarc / numcards) / 2)

  console.log(cards4)

  cardFanForSpecificHand(cards4,0);
  cardFanForSpecificHand(cards1,-180);

}

function cardFanForSpecificHand(hand,increment) {
  let angle = 60;

  for (let i = 0; i < hand.length; i++) {
    console.log(hand[i]);
    let s = `transform:translate(-0%,0%);rotate:${
     ( -angle / 2 + (angle / (10 + 1)) * i)+increment
    }deg;`;
    hand[i].style = s;
  }
}
