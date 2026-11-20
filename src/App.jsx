import { useRef, useState } from "react";

const symbols = ["🍒", "🍋", "🔔", "7️⃣"];
const spinCost = 10;

function App() {
  const [balance, setBalance] = useState(1000);
  const [reels, setReels] = useState(["🍒", "🍋", "🔔"]);
  const [result, setResult] = useState("Good luck!");
  const [isSpinning, setIsSpinning] = useState(false);
  const [winners, setWinners] = useState([]);
  const spinInterval = useRef(null);

  function spin() {
    if (isSpinning || balance < spinCost) {
      return;
    }

    setIsSpinning(true);
    setWinners([]);
    setBalance(currentBalance => currentBalance - spinCost);
    setResult("Spinning...");

    let count = 0;

    spinInterval.current = setInterval(() => {
      setReels(
        reels.map(() =>
          symbols[Math.floor(Math.random() * symbols.length)]
        )
      );

      count++;

      if (count >= 16) {
        clearInterval(spinInterval.current);
        finishSpin();
      }
    }, 100);
  }

  function finishSpin() {
    const finalReels = reels.map(() =>
      symbols[Math.floor(Math.random() * symbols.length)]
    );

    setReels(finalReels);

    const counts = {};

    finalReels.forEach(symbol => {
      counts[symbol] = (counts[symbol] || 0) + 1;
    });

    const highestMatch = Math.max(...Object.values(counts));
    let winnings = 0;

    if (highestMatch === 3) {
      winnings = 100;
      setResult("Jackpot! You won 100 coins!");
    } else if (highestMatch === 2) {
      winnings = 20;
      setResult("Two match! You won 20 coins!");
    } else {
      setResult("No match. Try again!");
    }

    if (highestMatch >= 2) {
      setWinners(finalReels);
    }

    setBalance(currentBalance => {
      const newBalance = currentBalance + winnings;

      if (newBalance < spinCost) {
        setResult(previousResult =>
          previousResult + " You're out of coins!"
        );
      }

      return newBalance;
    });

    setIsSpinning(false);
  }

  return (
    <main className="machine">
      <h1>Lucky Slots</h1>
      <p className="subtitle">Give the reels a spin!</p>

      <div className="balance" aria-live="polite">
        Balance: <span>{balance}</span> coins
      </div>

      <div className="reels" aria-label="Slot machine reels">
        {reels.map((symbol, index) => (
          <div
            key={index}
            className={[
              "reel",
              isSpinning ? "spinning" : "",
              winners.includes(symbol) ? "winner" : ""
            ].join(" ")}
          >
            {symbol}
          </div>
        ))}
      </div>

      <button
        onClick={spin}
        disabled={isSpinning || balance < spinCost}
      >
        Spin — 10 coins
      </button>

      <p className="result" aria-live="polite">
        {result}
      </p>

      <div className="payouts">
        3 matching symbols: win 100 coins
        <br />
        2 matching symbols: win 20 coins
      </div>
    </main>
  );
}

export default App;