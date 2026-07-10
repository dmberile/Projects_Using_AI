

# Projects

## [1_Three Men's Morris Game /](1_Three Men's Morris Game  - A Fun Game for the Brain 

A classic Three Men's Morris game built for my game project course, in two versions:

- **`index.html`** — a playable web version (works on phones too). No install needed.
- **`main.cpp`** — a C++ console version with the same rules

## Play it online 

## Link 
  https://dmberile.github.io/Projects-Using-AI/ 

![image alt](https://github.com/dmberile/Projects-Using-AI/blob/ab7f149e750f44a58df8c4ab1cd4248ce720cd7d/game.png) 
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

Includes Human vs Human and Human vs Computer modes. The computer plays:
win if possible → block the opponent's win → take the center → random safe move.
