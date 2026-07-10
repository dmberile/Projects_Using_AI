// ============================================================
//  Game Project MVP - Three Men's Morris style game
//  - 3x3 board, 2 players, 3 pieces each
//  - Phase 1: place all pieces   Phase 2: move to adjacent empty
//  - Win: align 3 pieces in a row / column / diagonal
//  - Modes: Human vs Human, Human vs Computer
//  Build:  g++ -std=c++17 -o game main.cpp
// ============================================================
#include <iostream>
#include <vector>
#include <array>
#include <string>
#include <set>
#include <utility>
#include <cstdlib>
#include <ctime>
#include <limits>

// ---------- ANSI colors (for "light up" available moves) ----------
const std::string RESET  = "\033[0m";
const std::string BLUE   = "\033[1;34m";
const std::string BLACK  = "\033[1;90m";   // bright black (gray) so it's visible
const std::string GREEN  = "\033[1;32m";   // highlight = available
const std::string YELLOW = "\033[1;33m";

enum Cell   { EMPTY = 0, P1 = 1, P2 = 2 };          // P1 = Blue, P2 = Black
enum Phase  { PLACEMENT, MOVEMENT };

// Cells are numbered 1-9 for the player, stored 0-8 internally:
//   1 2 3
//   4 5 6
//   7 8 9

// Adjacency along the drawn lines (rows, columns, and the two main
// diagonals through the center) - the classic "8 triangle quadrants" board.
const std::vector<std::vector<int>> ADJ = {
    /*0*/ {1, 3, 4},
    /*1*/ {0, 2, 4},
    /*2*/ {1, 4, 5},
    /*3*/ {0, 4, 6},
    /*4*/ {0, 1, 2, 3, 5, 6, 7, 8},
    /*5*/ {2, 4, 8},
    /*6*/ {3, 4, 7},
    /*7*/ {4, 6, 8},
    /*8*/ {4, 5, 7}
};

const int LINES[8][3] = {
    {0,1,2},{3,4,5},{6,7,8},          // rows
    {0,3,6},{1,4,7},{2,5,8},          // columns
    {0,4,8},{2,4,6}                   // diagonals
};

struct Move {                          // from == -1 means "placement"
    int from;
    int to;
    bool operator<(const Move& o) const {
        return std::tie(from, to) < std::tie(o.from, o.to);
    }
};

class Game {
public:
    std::array<Cell,9> board{};
    int placed[3] = {0,0,0};                 // pieces placed per player (index 1,2)
    std::set<std::pair<int,Move>> history;   // (player, move) - to reject repeats
    bool vsComputer = false;

    Phase phase() const {
        return (placed[1] < 3 || placed[2] < 3) ? PLACEMENT : MOVEMENT;
    }

    std::vector<Move> availableMoves(int player) const {
        std::vector<Move> moves;
        if (phase() == PLACEMENT) {
            for (int i = 0; i < 9; ++i)
                if (board[i] == EMPTY) moves.push_back({-1, i});
        } else {
            for (int i = 0; i < 9; ++i) {
                if (board[i] != player) continue;
                for (int n : ADJ[i]) {
                    if (board[n] != EMPTY) continue;
                    Move m{i, n};
                    if (!history.count({player, m}))   // "a move cannot be made more than once"
                        moves.push_back(m);
                }
            }
        }
        return moves;
    }

    void apply(int player, const Move& m) {
        if (m.from == -1) {
            board[m.to] = (Cell)player;
            placed[player]++;
        } else {
            board[m.from] = EMPTY;
            board[m.to]   = (Cell)player;
            history.insert({player, m});
        }
    }

    bool isWin(int player) const {
        for (auto& L : LINES)
            if (board[L[0]] == player && board[L[1]] == player && board[L[2]] == player)
                return true;
        return false;
    }

    // ---------- display ----------
    std::string cellStr(int i, const std::set<int>& highlight) const {
        if (board[i] == P1) return BLUE  + "B" + RESET;   // Blue
        if (board[i] == P2) return BLACK + "K" + RESET;   // blacK
        if (highlight.count(i)) return GREEN + std::to_string(i+1) + RESET;
        return std::to_string(i + 1);
    }

    void draw(const std::set<int>& highlight = {}) const {
        std::cout << "\n";
        for (int r = 0; r < 3; ++r) {
            std::cout << "   " << cellStr(r*3, highlight) << " - "
                      << cellStr(r*3+1, highlight) << " - "
                      << cellStr(r*3+2, highlight) << "\n";
            if (r == 0) std::cout << "   | \\ | / |\n";
            if (r == 1) std::cout << "   | / | \\ |\n";
        }
        std::cout << "\n";
    }
};

// ---------- input helper ----------
int readInt(const std::string& prompt) {
    int v;
    while (true) {
        std::cout << prompt;
        if (std::cin >> v) return v;
        if (std::cin.eof()) { std::cout << "\nInput closed. Exiting.\n"; std::exit(0); }
        std::cin.clear();
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
        std::cout << YELLOW << "  Please enter a number.\n" << RESET;
    }
}

// ---------- simple AI: win > block > center > random ----------
Move chooseComputerMove(Game& g, int me) {
    int opp = (me == P1) ? P2 : P1;
    auto moves = g.availableMoves(me);

    // 1. take a winning move
    for (auto& m : moves) {
        Game copy = g; copy.apply(me, m);
        if (copy.isWin(me)) return m;
    }
    // 2. keep only "safe" moves (ones that don't hand the opponent a win)
    std::vector<Move> safe;
    for (auto& m : moves) {
        Game copy = g; copy.apply(me, m);
        bool oppCanWin = false;
        for (auto& om : copy.availableMoves(opp)) {
            Game c2 = copy; c2.apply(opp, om);
            if (c2.isWin(opp)) { oppCanWin = true; break; }
        }
        if (!oppCanWin) safe.push_back(m);
    }
    if (safe.empty()) safe = moves;   // no safe option - play anything
    // 3. prefer the center
    for (auto& m : safe)
        if (m.to == 4) return m;
    // 4. random among the safe moves
    return safe[std::rand() % safe.size()];
}

// ---------- one full game ----------
void playGame(bool vsComputer) {
    Game g;
    g.vsComputer = vsComputer;
    int player = P1;

    while (true) {
        auto moves = g.availableMoves(player);

        // No legal moves in movement phase (all repeats used up) -> other player wins.
        if (moves.empty()) {
            std::cout << YELLOW << "\nPlayer " << player
                      << " has no legal moves left. "
                      << "Player " << (player == P1 ? 2 : 1) << " wins!\n" << RESET;
            return;
        }

        std::string name = (player == P1) ? BLUE + "Player 1 (Blue)" + RESET
                                          : BLACK + "Player 2 (Black)" + RESET;
        bool computerTurn = vsComputer && player == P2;

        // "light up" destination cells of every available move
        std::set<int> highlight;
        for (auto& m : moves) highlight.insert(m.to);
        g.draw(computerTurn ? std::set<int>{} : highlight);

        Move chosen;
        if (computerTurn) {
            chosen = chooseComputerMove(g, player);
            if (chosen.from == -1)
                std::cout << name << " places a piece on cell " << chosen.to + 1 << ".\n";
            else
                std::cout << name << " moves " << chosen.from + 1
                          << " -> " << chosen.to + 1 << ".\n";
        } else {
            std::cout << name << "'s turn ("
                      << (g.phase() == PLACEMENT ? "placement" : "movement")
                      << " phase). A move MUST be made - no forfeits.\n";
            while (true) {
                if (g.phase() == PLACEMENT) {
                    int to = readInt("  Place your piece on cell (1-9): ") - 1;
                    chosen = {-1, to};
                } else {
                    int from = readInt("  Move piece FROM cell: ") - 1;
                    int to   = readInt("  ...TO adjacent empty cell: ") - 1;
                    chosen = {from, to};
                }
                bool legal = false;
                for (auto& m : moves)
                    if (m.from == chosen.from && m.to == chosen.to) { legal = true; break; }
                if (legal) break;
                std::cout << YELLOW << "  Not an available move. Green cells show where you can go.\n" << RESET;
            }
        }

        g.apply(player, chosen);

        if (g.isWin(player)) {
            g.draw();
            std::cout << GREEN << ">>> " << name << GREEN << " WINS! <<<" << RESET << "\n";
            return;
        }
        player = (player == P1) ? P2 : P1;
    }
}

// ---------- main menu ----------
int main() {
    std::srand((unsigned)std::time(nullptr));
    std::cout << "==============================\n"
              << "   THREE MEN'S MORRIS - MVP\n"
              << "==============================\n";
    while (true) {
        std::cout << "\n[1] New Game: Human vs Human\n"
                  << "[2] New Game: Human vs Computer\n"
                  << "[3] Exit\n";
        int choice = readInt("Select: ");
        if (choice == 1) playGame(false);
        else if (choice == 2) playGame(true);
        else if (choice == 3) { std::cout << "Goodbye!\n"; return 0; }
        else std::cout << YELLOW << "Pick 1, 2 or 3.\n" << RESET;
    }
}
