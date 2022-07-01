import { DidIWon } from "./gameRules";

export function NewGame({gameStats,players}) {
  return (
    <div className="wrapper">
      <DidIWon gameStats={gameStats} players={players}/>
      <button id="newGame" onClick={playAgain}>
        Play Again
      </button>
    </div>
  );
}

function playAgain() {
  window.location.reload();
}
