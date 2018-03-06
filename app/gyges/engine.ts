import { Piece, Coordinate, Game, Player, GameStatus } from './models';
import {
  getCoordinate,
  getShoreCells,
  isShoreCell,
  isEmptyCell,
  isMoveValid,
  isWinMoveValid
} from './common';

const MOVE_NOTATION = /^([abcdefg][123456]-)+[abcdefg][123456](-g){0,1}$/g;

const isValidMoveNotation = (notation: string): boolean => {
  return (notation.toLowerCase().match(MOVE_NOTATION) || []).length === 1;
};

export function makeMove(game: Game, moveNotation: string): Game {
  if (game.status !== GameStatus.InProgress) {
    return;
  }

  if (!isValidMoveNotation(moveNotation)) {
    throw `illegal move notation (${moveNotation})`;
  }

  const moves = moveNotation.toLowerCase().split('-');
  const isWinMove = moves.indexOf('g') !== -1;

  if (isWinMove) {
    moves.pop();
  }

  const moveLength = moves.length;

  if (!isShoreCell(game.player, game.board, moves[0])) {
    throw `illegal move (${moveNotation})`;
  }

  const togglePlayer = () =>
    (game.player = game.player === Player.South ? Player.North : Player.South);

  const toggleState = (coordinate: Coordinate) => {
    game.winningPiece = game.board[coordinate.x][coordinate.y];
    game.board[coordinate.x][coordinate.y] = 0;
    game.status = game.player === Player.North ? GameStatus.NorthWon : GameStatus.SouthWon;
  };

  const updateCells = (from: string, to: string) => {
    const start = getCoordinate(game.board, from);
    const end = getCoordinate(game.board, to);
    const piece = game.board[start.x][start.y];

    game.board[start.x][start.y] = 0;
    game.board[end.x][end.y] = piece;
  };

  const validateBounce = (count: number) => {
    if (moveLength - 1 > count) {
      const from = moves[count];
      const to = moves[count + 1];

      if (!isMoveValid(game.board, from, to)) {
        throw `illegal move (${moveNotation})`;
      }

      validateBounce(count + 1);
    }
  };

  validateBounce(0);

  const coord = getCoordinate(game.board, moves[moveLength - 1]);

  if (!isEmptyCell(game.board, coord.x, coord.y)) {
    if (!isWinMove) {
      throw `illegal move (${moveNotation})`;
    }

    if (!isWinMoveValid(game.player, game.board, coord)) {
      throw `illegal move (${moveNotation})`;
    }
  }

  if (isWinMove) {
    toggleState(coord);
  } else {
    updateCells(moves[0], moves[moveLength - 1]);
    togglePlayer();
  }

  return game;
}
