# Lucky Slots 🎰

A colorful casino-style slot machine built with React and Vite. The player starts with 1,000 coins, pays 10 coins per spin, and can win by matching two or three reel symbols. Payouts depend on the symbol: cherries are the cheapest win, sevens pay the jackpot.

## Features

- Three animated slot reels
- Four symbols: cherry, lemon, bell, and 7
- Starting balance of 1,000 coins
- 10-coin cost per spin
- Symbol-based paytable (see below)
- Winning reels highlighted, with a special animation for triple sevens
- Animated reel spinning
- Automatic spin-button disabling when coins are insufficient
- Reset button that restores the 1,000-coin balance once the player can no longer afford a spin
- Responsive casino-style interface
- Beginner-friendly React code

## Payouts

Payouts live in `src/gameLogic.js` (`PAYTABLE`) and are paid on top of the balance after the 10-coin spin cost.

| Symbol | 2 match | 3 match |
| ------ | ------- | ------- |
| 🍒     | 2       | 30      |
| 🍋     | 3       | 60      |
| 🔔     | 5       | 120     |
| 7️⃣     | 7       | 300 (jackpot) |

With uniformly random reels this works out to roughly a 103% return, so the balance drifts up and down instead of draining instantly.

## Project Structure

```text
casino-slot-game/
├── index.html
├── package.json
└── src/
    ├── App.jsx
    ├── gameLogic.js
    ├── main.jsx
    └── styles.css
```