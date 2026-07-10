# Three Men's Morris — Game Project

A classic Three Men's Morris game built for my game project course, in two versions:

- **`index.html`** — a playable web version (works on phones too). No install needed.
- **`main.cpp`** — a C++ console version with the same rules and AI.

## Play it online

Once GitHub Pages is enabled for this repo (see below), anyone can play at:

```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

## Rules

- 3x3 board, 2 players (Blue and Black), 3 pieces each.
- **Placement phase:** players take turns placing pieces on empty spots.
- **Movement phase:** once all 6 pieces are down, move one of your pieces per
  turn along a drawn line to an adjacent empty spot.
- The exact same move cannot be made twice, and a turn cannot be skipped.
- First player to line up all 3 pieces vertically, horizontally, or
  diagonally wins. If a player has no legal moves left, the other player wins
  — so there are no draws.

## Playing the web version locally

Just open `index.html` in any browser.

## Building the C++ version

```bash
g++ -std=c++17 -o game main.cpp
./game
```

Includes Human vs Human and Human vs Computer modes. The computer plays:
win if possible → block the opponent's win → take the center → random safe move.

## Hosting it with GitHub Pages (free)

1. In this repo on GitHub, go to **Settings → Pages**.
2. Under "Build and deployment", set **Source** to "Deploy from a branch",
   choose the **main** branch and the **/ (root)** folder, and save.
3. After a minute or two, the game is live at
   `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`. Share that link with
   anyone — it works on desktop and mobile.
