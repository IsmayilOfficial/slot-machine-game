import { useEffect, useRef, useState } from "react";
import {
  PAYTABLE,
  SPIN_COST,
  SYMBOLS,
  evaluateSpin,
  spinReels
} from "./gameLogic";

const spinDuration = 1600;
const spinTick = 100;
const startingBalance = 1000;

function App() {
  const [balance, setBalance] = useState(startingBalance);
  const [reels, setReels] = useState(spinReels);
  const [outcome, setOutcome] = useState({
    tier: "none",
    message: "Good luck!"
  });
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningIndexes, setWinningIndexes] = useState([]);
  const spinInterval = useRef(null);

  useEffect(() => () => clearInterval(spinInterval.current), []);

  // Keep the wallet pure: one change per spin phase, never nested in a setter.
  function changeBalance(amount) {
    setBalance(current => current + amount);
  }

  function spin() {
    if (isSpinning || balance < SPIN_COST) {
      return;
    }

    setIsSpinning(true);
    setWinningIndexes([]);
    setOutcome({ tier: "none", message: "Spinning..." });
    changeBalance(-SPIN_COST);

    let ticks = 0;

    spinInterval.current = setInterval(() => {
      setReels(spinReels());

      ticks++;

      if (ticks >= spinDuration / spinTick) {
        clearInterval(spinInterval.current);
        settle();
      }
    }, spinTick);
  }

  function settle() {
    const finalReels = spinReels();
    const { tier, message, payout, winningIndexes: matched } =
      evaluateSpin(finalReels);

    setReels(finalReels);
    setWinningIndexes(matched);
    setOutcome({ tier, message });
    changeBalance(payout);
    setIsSpinning(false);
  }

  function resetBalance() {
    clearInterval(spinInterval.current);
    setIsSpinning(false);
    setWinningIndexes([]);
    setOutcome({ tier: "none", message: "Fresh stack. Good luck!" });
    setBalance(startingBalance);
  }

  const outOfCoins = !isSpinning && balance < SPIN_COST;

  return (
    <main className="machine">
      <h1>Lucky Slots</h1>
      <p className="subtitle">Give the reels a spin!</p>

      <div className="balance" aria-live="polite">
        Balance: <span>{balance}</span> coins
      </div>

      <div className="reels" aria-label="Slot machine reels">
        {reels.map((symbol, index) => {
          const isWinner = winningIndexes.includes(index);
          const isJackpot = isWinner && outcome.tier === "jackpot";

          return (
            <div
              key={index}
              className={[
                "reel",
                isSpinning ? "spinning" : "",
                isWinner ? "winner" : "",
                isJackpot ? "jackpot" : ""
              ].join(" ")}
            >
              {symbol}
            </div>
          );
        })}
      </div>

      <button onClick={spin} disabled={isSpinning || balance < SPIN_COST}>
        Spin — {SPIN_COST} coins
      </button>

      {outOfCoins ? (
        <button className="reset" onClick={resetBalance}>
          Reset to {startingBalance} coins
        </button>
      ) : null}

      <p className={`result ${outcome.tier}`} aria-live="polite">
        {outcome.message}
        {outOfCoins ? " You're out of coins!" : ""}
      </p>

      <table className="payouts">
        <caption>Payouts</caption>
        <thead>
          <tr>
            <th scope="col">Symbol</th>
            <th scope="col">2 match</th>
            <th scope="col">3 match</th>
          </tr>
        </thead>
        <tbody>
          {SYMBOLS.map(symbol => (
            <tr key={symbol}>
              <th scope="row">{symbol}</th>
              <td>{PAYTABLE[symbol].two}</td>
              <td>{PAYTABLE[symbol].three}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default App;
