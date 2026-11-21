export const SYMBOLS = ["🍒", "🍋", "🔔", "7️⃣"];
export const SPIN_COST = 10;
export const REEL_COUNT = 3;

// Payouts scale with the symbol: cherries are the cheapest win, sevens pay the
// jackpot. Two of a kind is a small consolation, three of a kind is a real win.
export const PAYTABLE = {
  "🍒": { two: 2, three: 30 },
  "🍋": { two: 3, three: 60 },
  "🔔": { two: 5, three: 120 },
  "7️⃣": { two: 7, three: 300 }
};

const JACKPOT_SYMBOL = "7️⃣";

export function randomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

export function spinReels() {
  return Array.from({ length: REEL_COUNT }, randomSymbol);
}

export function evaluateSpin(reels) {
  const counts = reels.reduce((totals, symbol) => {
    totals[symbol] = (totals[symbol] || 0) + 1;
    return totals;
  }, {});

  const bestSymbol = Object.keys(counts).sort(
    (first, second) => counts[second] - counts[first]
  )[0];
  const matches = counts[bestSymbol] || 0;

  if (matches < 2) {
    return {
      tier: "none",
      payout: 0,
      message: "No match. Try again!",
      winningIndexes: []
    };
  }

  const winningIndexes = reels
    .map((symbol, index) => (symbol === bestSymbol ? index : -1))
    .filter(index => index !== -1);

  const isFullHouse = matches === REEL_COUNT;
  const tier = isFullHouse
    ? bestSymbol === JACKPOT_SYMBOL
      ? "jackpot"
      : "three"
    : "two";
  const payout = isFullHouse
    ? PAYTABLE[bestSymbol].three
    : PAYTABLE[bestSymbol].two;

  return {
    tier,
    payout,
    message: describeWin(bestSymbol, payout, tier),
    winningIndexes
  };
}

function describeWin(symbol, payout, tier) {
  if (tier === "jackpot") {
    return `JACKPOT! Three ${symbol} pay ${payout} coins!`;
  }

  if (tier === "three") {
    return `Three ${symbol} match! You won ${payout} coins!`;
  }

  return `Two ${symbol} match! You won ${payout} coins!`;
}
