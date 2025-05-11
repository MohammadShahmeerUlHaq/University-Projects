import random
import numpy as np
import time
import os
from enum import Enum
from typing import List, Tuple, Dict, Optional, Set
import copy


class Player:
    def __init__(self, id: int, name: str, team: int = None, is_ai: bool = False):
        self.id = id  # Player ID (1, 2, 3, or 4)
        self.name = name  # Player name
        self.team = team if team is not None else id  # Team ID (1 or 2 in team mode)
        self.score = 2  # Starting with 2 pieces for each player
        self.color = self._get_color() # Assigning different color to each player pieces
        self.is_ai = is_ai  # Flag to identify AI players
        self.penalization_count = 0  # Track penalizations

    def get_final_score(self):
        """Returns score with penalization adjustments"""
        return self.score - (5 * self.penalization_count)

    def _get_color(self) -> str:
        colors = {
            1: "\033[1;34mB\033[0m",  # Blue
            2: "\033[1;31mR\033[0m",  # Red
            3: "\033[1;32mG\033[0m",  # Green
            4: "\033[1;33mY\033[0m"   # Yellow
        }
        return colors.get(self.id, "X")

    def __str__(self) -> str:
        ai_tag = "(AI)" if self.is_ai else ""
        return f"Player {self.id} {self.name} {ai_tag}: {self.score} pieces"


class SpecialTileType(Enum):
    DOUBLE_MOVE = 1
    PIECE_REMOVAL = 2
    PENALIZATION = 3

class SpecialTile:
    def __init__(self, type: SpecialTileType, position: Tuple[int, int]):
        self.type = type
        self.position = position
        self.activated = False

    # Modify the SpecialTile.activate method to track penalizations
    def activate(self, game, player: Player):
        if self.activated:
            return False

        self.activated = True
        if self.type == SpecialTileType.DOUBLE_MOVE:
            return "double_move"
        elif self.type == SpecialTileType.PIECE_REMOVAL:
            return "piece_removal"
        elif self.type == SpecialTileType.PENALIZATION:
            player.penalization_count += 1  # Track the penalization
            return "penalization"

        return None


class ReversiGame:
    def __init__(self, board_size: int = 8, num_players: int = 2, team_mode: bool = False):
        self.board_size = board_size
        self.num_players = num_players
        self.team_mode = team_mode
        self.players = []
        self.current_player_idx = 0
        self.board = None
        self.special_tiles = {}
        self.game_over = False
        self.winner = None
        self.current_effect = None
        self.directions = [(0, 1), (1, 1), (1, 0), (1, -1), (0, -1), (-1, -1), (-1, 0), (-1, 1)]

    def create_players(self, names: List[str], ai_players: List[int] = None):
        self.players = []
        for i in range(self.num_players):
            # Check if this player is an AI player
            is_ai = ai_players and (i+1) in ai_players

            # Assign teams if in team mode
            team = None
            if self.team_mode:
                team = 1 if i % 2 == 0 else 2

            self.players.append(Player(i + 1, names[i], team, is_ai))

    def initialize_board(self):
        # Create empty board
        self.board = np.zeros((self.board_size, self.board_size), dtype=int)

        # Set up initial pieces in the center
        center = self.board_size // 2

        if self.num_players == 2:
            # Standard 2-player setup
            self.board[center-1][center-1] = 2
            self.board[center][center] = 2

            self.board[center-1][center] = 1
            self.board[center][center-1] = 1
        else:
            # 4-player setup
            self.board[center-1][center-1] = 1
            self.board[center][center] = 1

            self.board[center-1][center] = 2
            self.board[center][center-1] = 2

            self.board[center-2][center-2] = 3
            self.board[center+1][center+1] = 3

            self.board[center-2][center+1] = 4
            self.board[center+1][center-2] = 4

        # Generate special tiles (about 5% of the board)
        self._generate_special_tiles()

        # Update initial scores
        self._update_scores()

    def _generate_special_tiles(self):
        self.special_tiles = {}
        num_tiles = (self.board_size * self.board_size) // 20  # About 5% of the board

        empty_cells = []
        for i in range(self.board_size):
            for j in range(self.board_size):
                if self.board[i][j] == 0:
                    empty_cells.append((i, j))

        # Select random positions for special tiles
        positions = random.sample(empty_cells, min(num_tiles, len(empty_cells)))

        for pos in positions:
            # Random special tile type
            tile_type = random.choice(list(SpecialTileType))
            self.special_tiles[pos] = SpecialTile(tile_type, pos)

    def _update_scores(self):
        # Reset scores
        for player in self.players:
            player.score = 0

        # Count pieces on the board
        for i in range(self.board_size):
            for j in range(self.board_size):
                if self.board[i][j] > 0:
                    player_idx = self.board[i][j] - 1
                    if player_idx < len(self.players):
                        self.players[player_idx].score += 1

    def get_valid_moves(self, player_id: int) -> Dict[Tuple[int, int], List[Tuple[int, int]]]:
        valid_moves = {}
        for i in range(self.board_size):
            for j in range(self.board_size):
                if self.board[i][j] != 0:
                    continue

                captures = self._get_captures((i, j), player_id)
                if captures:
                    valid_moves[(i, j)] = captures

        return valid_moves

    def _get_captures(self, pos: Tuple[int, int], player_id: int) -> List[Tuple[int, int]]:
        i, j = pos
        if self.board[i][j] != 0:
            return []

        captures = []
        player = self.players[player_id - 1]

        for di, dj in self.directions:
            direction_captures = []
            ni, nj = i + di, j + dj

            # Find opponent pieces to capture
            while 0 <= ni < self.board_size and 0 <= nj < self.board_size:
                if self.board[ni][nj] == 0:
                    break

                if self.board[ni][nj] == player_id:
                    # Found our piece, all pieces in between can be captured
                    captures.extend(direction_captures)
                    break

                # In team mode, don't capture teammate's pieces
                if self.team_mode:
                    teammate = False
                    for p in self.players:
                        if p.id == self.board[ni][nj] and p.team == player.team:
                            teammate = True
                            break
                    if teammate:
                        break

                direction_captures.append((ni, nj))
                ni += di
                nj += dj

        return captures

    def make_move(self, pos: Tuple[int, int], player_id: int) -> Optional[str]:
        if self.game_over:
            return None

        i, j = pos
        valid_moves = self.get_valid_moves(player_id)

        if pos not in valid_moves:
            return None  # Invalid move

        # Place the piece
        self.board[i][j] = player_id

        # Flip captured pieces
        for ni, nj in valid_moves[pos]:
            self.board[ni][nj] = player_id

        # Check if position has a special tile
        special_effect = None
        if pos in self.special_tiles and not self.special_tiles[pos].activated:
            special_effect = self.special_tiles[pos].activate(self, self.players[player_id - 1])

        # Update scores
        self._update_scores()

        return special_effect

    def next_player(self):
        # Store original player index to detect full cycle
        original_idx = self.current_player_idx

        # Find next player with valid moves
        for _ in range(self.num_players):
            # Move to next player
            self.current_player_idx = (self.current_player_idx + 1) % self.num_players
            player = self.players[self.current_player_idx]

            # Check if this player has valid moves
            if self.get_valid_moves(player.id):
                return True  # Found a player with valid moves

        # If we checked all players and none have valid moves, game is over
        self.game_over = True
        self._determine_winner()
        return False

    def _determine_winner(self):
        if not self.team_mode:
            # Individual players mode
            max_score = float('-inf')
            winners = []

            for player in self.players:
                final_score = player.get_final_score()
                if final_score > max_score:
                    max_score = final_score
                    winners = [player]
                elif final_score == max_score:
                    winners.append(player)

            self.winner = winners
        else:
            # Team mode
            team_scores = {}
            for player in self.players:
                team = player.team
                if team not in team_scores:
                    team_scores[team] = 0
                team_scores[team] += player.get_final_score()

            max_score = float('-inf')
            winning_team = None

            for team, score in team_scores.items():
                if score > max_score:
                    max_score = score
                    winning_team = team

            self.winner = [p for p in self.players if p.team == winning_team]

    def display_board(self):
        os.system('cls' if os.name == 'nt' else 'clear')
        print(f"{'REVERSI':^{self.board_size * 4}}")
        print(f"{'=' * (self.board_size * 4)}")

        # Display column indices
        print("  ", end="")
        for j in range(self.board_size):
            print(f" {j} ", end="")
        print("\n")

        # Display board
        for i in range(self.board_size):
            print(f"{i} ", end="")
            for j in range(self.board_size):
                cell = self.board[i][j]

                # Check if cell has a special tile
                special_marker = ""
                if (i, j) in self.special_tiles and not self.special_tiles[(i, j)].activated:
                    if self.special_tiles[(i, j)].type == SpecialTileType.DOUBLE_MOVE:
                        special_marker = "⭐"
                    elif self.special_tiles[(i, j)].type == SpecialTileType.PIECE_REMOVAL:
                        special_marker = "🟢"
                    elif self.special_tiles[(i, j)].type == SpecialTileType.PENALIZATION:
                        special_marker = "⚠️"

                if cell == 0:
                    print(f" {special_marker or '.'} ", end="")
                else:
                    player = self.players[cell - 1]
                    print(f" {player.color} ", end="")
            print(f" {i}")

        # Display column indices again
        print("\n  ", end="")
        for j in range(self.board_size):
            print(f" {j} ", end="")
        print("\n")

        # Display legend for special tiles
        print("Special Tiles:")
        print("⭐ - Double Move | 🟢 - Piece Removal | ⚠️ - Penalization")

        # Display player information
        if self.team_mode:
            team_scores = {}
            for player in self.players:
                if player.team not in team_scores:
                    team_scores[player.team] = 0
                team_scores[player.team] += player.score

            print("\nTeam Scores:")
            for team, score in team_scores.items():
                print(f"Team {team}: {score} pieces")

        print("\nPlayer Information:")
        for player in self.players:
            ai_tag = "(AI)" if player.is_ai else ""
            print(f"{player.name} {ai_tag} ({player.color}): {player.score} pieces")

        current_player = self.players[self.current_player_idx]
        print(f"\nCurrent Player: {current_player.name} ({current_player.color})")


class AI:
    def __init__(self, player_id: int, difficulty: int = 3):
        """
        Initialize AI player with a difficulty level:
        1: Easy (random moves)
        2: Medium (basic heuristic, shallow depth)
        3: Hard (full minimax with alpha-beta pruning, deeper search)
        """
        self.player_id = player_id
        self.difficulty = difficulty
        self.weights = self._initialize_weights()

    def _initialize_weights(self):
        """Creates weight matrix for board evaluation"""
        # Higher values in corners and edges, lower in danger zones
        return [
            [100, -20, 10, 5, 5, 10, -20, 100],
            [-20, -50, -2, -2, -2, -2, -50, -20],
            [10, -2, -1, -1, -1, -1, -2, 10],
            [5, -2, -1, -1, -1, -1, -2, 5],
            [5, -2, -1, -1, -1, -1, -2, 5],
            [10, -2, -1, -1, -1, -1, -2, 10],
            [-20, -50, -2, -2, -2, -2, -50, -20],
            [100, -20, 10, 5, 5, 10, -20, 100]
        ]

    def get_move(self, game: ReversiGame) -> Optional[Tuple[int, int]]:
        """Returns the best move for the AI player based on difficulty level"""
        valid_moves = game.get_valid_moves(self.player_id)
        if not valid_moves:
            return None

        if self.difficulty == 1:
            # Easy: Random move
            return random.choice(list(valid_moves.keys()))

        elif self.difficulty == 2:
            # Medium: Simple heuristic evaluation, no lookahead
            best_score = float('-inf')
            best_move = None

            for move in valid_moves:
                # Create a copy of the game state
                test_game = self._copy_game_state(game)

                # Make the move
                test_game.make_move(move, self.player_id)

                # Evaluate the resulting board
                score = self._evaluate_board(test_game)

                if score > best_score:
                    best_score = score
                    best_move = move

            return best_move

        else:
            # Hard: Minimax with alpha-beta pruning
            depth = 4  # Search depth
            best_score = float('-inf')
            best_move = None
            alpha = float('-inf')
            beta = float('inf')

            for move in valid_moves:
                # Create a copy of the game state
                test_game = self._copy_game_state(game)

                # Make the move
                special_effect = test_game.make_move(move, self.player_id)

                # Handle special effects
                if special_effect == "double_move":
                    # For double move, we evaluate with the same player (maximizing)
                    score = self._minimax(test_game, depth-1, alpha, beta, True)
                elif special_effect == "penalization":
                    # For penalization, we evaluate with the opponent getting an extra turn (minimizing twice)
                    test_game.next_player()  # Move to next player
                    score = self._minimax(test_game, depth-1, alpha, beta, False)
                else:
                    # Normal case - evaluate with next player's turn
                    test_game.next_player()
                    score = self._minimax(test_game, depth-1, alpha, beta, False)

                if score > best_score:
                    best_score = score
                    best_move = move

                alpha = max(alpha, best_score)

            return best_move

    def _copy_game_state(self, game: ReversiGame) -> ReversiGame:
        """Creates a deep copy of the game state for simulation"""
        new_game = ReversiGame(board_size=game.board_size, num_players=game.num_players, team_mode=game.team_mode)

        # Copy players
        new_game.players = copy.deepcopy(game.players)

        # Copy board
        new_game.board = np.copy(game.board)

        # Copy special tiles
        new_game.special_tiles = copy.deepcopy(game.special_tiles)

        # Copy game state
        new_game.current_player_idx = game.current_player_idx
        new_game.game_over = game.game_over

        return new_game

    def _minimax(self, game: ReversiGame, depth: int, alpha: float, beta: float, is_maximizing: bool) -> float:
        """Minimax algorithm with alpha-beta pruning"""
        # Terminal conditions
        if depth == 0 or game.game_over:
            return self._evaluate_board(game)

        current_player = game.players[game.current_player_idx]
        valid_moves = game.get_valid_moves(current_player.id)

        # If no valid moves, skip to next player
        if not valid_moves:
            test_game = self._copy_game_state(game)
            test_game.next_player()
            return self._minimax(test_game, depth-1, alpha, beta, not is_maximizing)

        if is_maximizing:
            # AI's turn (maximizing player)
            max_eval = float('-inf')

            for move in valid_moves:
                test_game = self._copy_game_state(game)
                special_effect = test_game.make_move(move, current_player.id)

                # Handle special effects
                if special_effect == "double_move":
                    # Stay with the same player (still maximizing)
                    eval = self._minimax(test_game, depth-1, alpha, beta, True)
                elif special_effect == "penalization":
                    # Skip to opponent with extra turn (minimizing twice)
                    test_game.next_player()
                    eval = self._minimax(test_game, depth-1, alpha, beta, False)
                else:
                    # Normal case - next player's turn
                    test_game.next_player()
                    eval = self._minimax(test_game, depth-1, alpha, beta, False)

                max_eval = max(max_eval, eval)
                alpha = max(alpha, eval)

                if beta <= alpha:
                    break

            return max_eval

        else:
            # Opponent's turn (minimizing player)
            min_eval = float('inf')

            for move in valid_moves:
                test_game = self._copy_game_state(game)
                special_effect = test_game.make_move(move, current_player.id)

                # Handle special effects
                if special_effect == "double_move":
                    # Stay with same player (still minimizing)
                    eval = self._minimax(test_game, depth-1, alpha, beta, False)
                elif special_effect == "penalization":
                    # Skip to our player with extra turn (maximizing twice)
                    test_game.next_player()
                    eval = self._minimax(test_game, depth-1, alpha, beta, True)
                else:
                    # Normal case - next player's turn
                    test_game.next_player()
                    eval = self._minimax(test_game, depth-1, alpha, beta, True)

                min_eval = min(min_eval, eval)
                beta = min(beta, eval)

                if beta <= alpha:
                    break

            return min_eval

    def _evaluate_board(self, game: ReversiGame) -> float:
        # Calculate score based on piece count
        if game.team_mode:
            ai_player = game.players[self.player_id - 1]
            ai_team = ai_player.team

            team_scores = {}
            for player in game.players:
                if player.team not in team_scores:
                    team_scores[player.team] = 0
                team_scores[player.team] += player.score

            # Calculate relative score difference
            my_team_score = team_scores.get(ai_team, 0)
            opponent_team_score = sum(score for team, score in team_scores.items() if team != ai_team)

            score_diff = my_team_score - opponent_team_score
        else:
            # Regular mode
            my_score = game.players[self.player_id - 1].score
            opponent_score = sum(p.score for p in game.players if p.id != self.player_id)

            score_diff = my_score - opponent_score

        # Position-based evaluation with weights
        position_score = 0
        for i in range(min(game.board_size, 8)):  # Use 8x8 weight matrix or smaller
            for j in range(min(game.board_size, 8)):
                if game.board[i][j] == self.player_id:
                    position_score += self.weights[i][j]
                elif game.board[i][j] > 0:  # Opponent's piece
                    # In team mode, only count opponents from other team
                    if game.team_mode:
                        opponent_player = game.players[game.board[i][j] - 1]
                        ai_player = game.players[self.player_id - 1]
                        if opponent_player.team != ai_player.team:
                            position_score -= self.weights[i][j]
                    else:
                        position_score -= self.weights[i][j]

        # Mobility (number of valid moves)
        my_mobility = len(game.get_valid_moves(self.player_id))

        # SPECIAL TILE EVALUATION
        special_tile_score = 0
        valid_moves = game.get_valid_moves(self.player_id)

        # Check if any of our valid moves land on special tiles
        for move in valid_moves:
            if move in game.special_tiles and not game.special_tiles[move].activated:
                special_tile = game.special_tiles[move]

                # Value different special tiles accordingly
                if special_tile.type == SpecialTileType.DOUBLE_MOVE:
                    special_tile_score += 30  # Very valuable - get an extra move
                elif special_tile.type == SpecialTileType.PIECE_REMOVAL:
                    special_tile_score += 25  # Valuable - remove opponent piece
                elif special_tile.type == SpecialTileType.PENALIZATION:
                    special_tile_score -= 40  # Avoid this tile if possible

        # Combine all factors with appropriate weights
        # Incorporating special_tile_score in evaluation
        return score_diff * 10 + position_score + my_mobility * 5 + special_tile_score


def handle_ai_special_effects(game, player, move, special_effect):
    """Handle special tile effects for AI players"""
    if special_effect == "piece_removal":
        # AI removes opponent's piece strategically
        best_removal = None
        best_removal_score = float('-inf')

        # Find all opponent pieces
        opponent_pieces = []
        for i in range(game.board_size):
            for j in range(game.board_size):
                if game.board[i][j] > 0 and game.board[i][j] != player.id:
                    # In team mode, check if it's not a teammate
                    if game.team_mode:
                        is_teammate = False
                        for p in game.players:
                            if p.id == game.board[i][j] and p.team == player.team:
                                is_teammate = True
                                break
                        if is_teammate:
                            continue
                    opponent_pieces.append((i, j))

        if opponent_pieces:
            # Prioritize corner and edge pieces
            for pos in opponent_pieces:
                i, j = pos
                # Check if it's a corner
                if (i == 0 or i == game.board_size-1) and (j == 0 or j == game.board_size-1):
                    score = 100
                # Check if it's on an edge
                elif i == 0 or i == game.board_size-1 or j == 0 or j == game.board_size-1:
                    score = 50
                else:
                    score = 10

                if score > best_removal_score:
                    best_removal_score = score
                    best_removal = pos

            if best_removal:
                i, j = best_removal
                print(f"AI {player.name} removes opponent's piece at position {i},{j}")
                game.board[i][j] = 0
                game._update_scores()
                time.sleep(1)


def run_game():
    print("Welcome to Multiplayer Reversi with Special Features!")

    # Get board size
    while True:
        try:
            size = int(input("Choose board size (8, 10, or 12): "))
            if size not in [8, 10, 12]:
                print("Please enter 8, 10, or 12.")
                continue
            break
        except ValueError:
            print("Please enter a valid number.")

    # Get number of players
    while True:
        try:
            num_players = int(input("Number of players (2 or 4): "))
            if num_players not in [2, 4]:
                print("Please enter 2 or 4.")
                continue
            break
        except ValueError:
            print("Please enter a valid number.")

    # Team mode (only applicable for 4 players)
    team_mode = False
    if num_players == 4:
        team_mode_input = input("Play in team mode (2v2)? (y/n): ").lower()
        team_mode = team_mode_input == 'y'

    # Set up AI players
    ai_players = []
    player_names = []
    ai_instances = {}

    print("\nSelect which players should be AI:")
    for i in range(num_players):
        while True:
            is_ai = input(f"Is Player {i+1} an AI? (y/n): ").lower()
            if is_ai not in ['y', 'n']:
                print("Please enter 'y' or 'n'.")
                continue
            break

        if is_ai == 'y':
            ai_players.append(i+1)

            # Get AI difficulty
            while True:
                try:
                    difficulty = int(input(f"Select difficulty for AI Player {i+1} (1=Easy, 2=Medium, 3=Hard): "))
                    if difficulty not in [1, 2, 3]:
                        print("Please enter 1, 2, or 3.")
                        continue
                    break
                except ValueError:
                    print("Please enter a valid number.")

            player_names.append(f"AI-{i+1}")
            ai_instances[i+1] = AI(i+1, difficulty)
        else:
            name = input(f"Enter name for Player {i+1}: ")
            player_names.append(name or f"Player {i+1}")

    # Initialize game
    game = ReversiGame(board_size=size, num_players=num_players, team_mode=team_mode)
    game.create_players(player_names, ai_players)
    game.initialize_board()

    # Main game loop
    while not game.game_over:
        game.display_board()

        current_player = game.players[game.current_player_idx]
        valid_moves = game.get_valid_moves(current_player.id)

        if not valid_moves:
            print(f"{current_player.name} has no valid moves. Skipping turn.")
            time.sleep(2)
            game.next_player()
            continue

        # Show valid moves
        print(f"Valid moves for {current_player.name}: ", end="")
        for move in valid_moves.keys():
            print(f"{move}", end=" ")
        print()

        # Handle player move (human or AI)
        if current_player.is_ai:
            print(f"AI {current_player.name} is thinking...")
            time.sleep(1)  # Add a small delay to make AI's turn visible

            # Get AI move
            ai = ai_instances[current_player.id]
            move = ai.get_move(game)
            print(f"AI {current_player.name} plays at {move}")
            time.sleep(1)

            # Make the move
            special_effect = game.make_move(move, current_player.id)

            # Handle special effects for AI
            if special_effect == "double_move":
                print(f"AI {current_player.name} gets another turn due to special tile!")
                time.sleep(1)
                continue
            elif special_effect == "piece_removal":
                handle_ai_special_effects(game, current_player, move, special_effect)
            elif special_effect == "penalization":
                print(f"AI {current_player.name} is penalized! Next player gets an extra turn.")
                time.sleep(1)
                game.next_player()
                continue
        else:
            # Human player's turn
            move = None
            while move not in valid_moves:
                try:
                    move_input = input(f"{current_player.name}, enter your move (row,col): ")
                    row, col = map(int, move_input.split(','))
                    move = (row, col)

                    if move not in valid_moves:
                        print("Invalid move. Try again.")
                except (ValueError, IndexError):
                    print("Please enter row,col format (e.g., '2,3')")

            # Make the move
            special_effect = game.make_move(move, current_player.id)

            # Handle special effects for human player
            if special_effect == "double_move":
                # Player gets another turn
                continue
            elif special_effect == "piece_removal":
                # Player can remove an opponent's piece
                valid_removal = False
                while not valid_removal:
                    try:
                        removal_input = input("Enter position to remove opponent's piece (row,col): ")
                        r_row, r_col = map(int, removal_input.split(','))

                        if 0 <= r_row < game.board_size and 0 <= r_col < game.board_size:
                            cell = game.board[r_row][r_col]
                            # Check if it's an opponent's piece
                            if cell > 0 and cell != current_player.id:
                                if game.team_mode:
                                    # In team mode, check if it's not a teammate
                                    for p in game.players:
                                        if p.id == cell and p.team == current_player.team:
                                            print("Cannot remove teammate's piece!")
                                            continue

                                # Remove the piece
                                game.board[r_row][r_col] = 0
                                game._update_scores()
                                valid_removal = True
                            else:
                                print("You can only remove opponent's pieces!")
                        else:
                            print("Position out of bounds!")
                    except (ValueError, IndexError):
                        print("Please enter row,col format (e.g., '2,3')")
            elif special_effect == "penalization":
                # Skip to the next player and give them an extra move
                game.next_player()
                game.display_board()
                print(f"{game.players[game.current_player_idx].name} gets an extra move due to the penalty!")
                time.sleep(2)
                continue

        # Next player's turn
        game.next_player()

    # Game over
    game.display_board()
    print("Game Over!")

    if game.winner:
        if len(game.winner) == 1:
            winner = game.winner[0]
            print(f"{winner.name} wins with {winner.get_final_score()} points!")
            print(f"(Base: {winner.score} pieces, Penalty: -{winner.penalization_count * 5})")
        else:
            if game.team_mode:
                team = game.winner[0].team
                team_score = sum(p.get_final_score() for p in game.winner)
                print(f"Team {team} wins with {team_score} points!")
                for p in game.winner:
                    print(f"{p.name}: {p.score} pieces, Penalty: -{p.penalization_count * 5}")
            else:
                print("It's a tie between:")
                for p in game.winner:
                    print(f"{p.name}: {p.get_final_score()} points (Base: {p.score}, Penalty: -{p.penalization_count * 5})")
    else:
        print("It's a tie!")


if __name__ == "__main__":
    run_game(),