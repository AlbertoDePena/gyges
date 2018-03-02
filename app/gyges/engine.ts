import { Piece, Coordinate, Game, Player } from './models';
import { isShoreCell, getCoordinates, getShoreCells, calculateY } from './common';

const MOVE_NOTATION = /^([abcdefg][123456]-)+[abcdefg][123456]$/g;

const CELLS = [
  'a6', 'b6', 'c6', 'd6', 'e6', 'f6',
  'a5', 'b5', 'c5', 'd5', 'e5', 'f5',
  'a4', 'b4', 'c4', 'd4', 'e4', 'f4',
  'a3', 'b3', 'c3', 'd3', 'e3', 'f3',
  'a2', 'b2', 'c2', 'd2', 'e2', 'f2',
  'a1', 'b1', 'c1', 'd1', 'e1', 'f1',
];

export const isValidMoveNotation = (notation: string): boolean => (notation.match(MOVE_NOTATION) || []).length === 1;

export const isCellEmpty = (board: number[][], x: number, y: number): boolean => {
  if (x > 5 || x < 0) { return false; }
  if (y > 5 || y < 0) { return false; }
  return board[x][y] === 0;
};

export const isValidBounce = (board: number[][], from: Coordinate, to: Coordinate): boolean => {
  if (!from || !to) { return false; }
  const x = Math.abs(to.x - from.x);
  const y = Math.abs(to.y - from.y);
  const piece = board[from.x][from.y];
  return (x + y) <= piece;
};

export const canBouncePiece = (player: Player, board: number[][], cell: string) => {
  const coords = getCoordinates(board, cell);
  const checkCoords =
    (incrementX: number, incrementY: number) =>
      isCellEmpty(board, coords.x + incrementX, calculateY(player, coords, incrementY));
  const piece = board[coords.x][coords.y];

  switch (piece) {
    case Piece.Single: return true;
    case Piece.Double:
      if (checkCoords(1, 0) || checkCoords(-1, 0)) { return true; }
      return checkCoords(0, 1);
    case Piece.Triple:
      if (checkCoords(1, 0) || checkCoords(2, 0) || checkCoords(-1, 0) || checkCoords(-2, 0)) { return true; }
      if (checkCoords(0, 1) || checkCoords(0, 2)) { return true; }
      return checkCoords(1, 1) || checkCoords(-1, 1);
    default: return false;
  }
};
/*
export const getAvailableCells = (board: Board, player: Player, cell: Cell): Cell[] => {
  if (!cell.piece) { throw 'piece is null'; }

  switch (cell.piece) {
    case Piece.Single:
      return [
        findCellByCoords(board, cell.coordinate.x, calculateY(player, cell, 1))
      ];
    case Piece.Double:
      return [
        findCellByCoords(board, cell.coordinate.x, calculateY(player, cell, 2)),
        findCellByCoords(board, cell.coordinate.x + 1, calculateY(player, cell, 1)),
        findCellByCoords(board, cell.coordinate.x - 1, calculateY(player, cell, 1))
      ];
    case Piece.Triple:
      return [
        findCellByCoords(board, cell.coordinate.x, calculateY(player, cell, 3)),
        findCellByCoords(board, cell.coordinate.x + 1, calculateY(player, cell, 2)),
        findCellByCoords(board, cell.coordinate.x - 1, calculateY(player, cell, 2)),
        findCellByCoords(board, cell.coordinate.x + 2, calculateY(player, cell, 1)),
        findCellByCoords(board, cell.coordinate.x - 2, calculateY(player, cell, 1))
      ];
    default: return [];
  }
};
*/
export function makeMove(game: Game, moveNotation: string): Game {
  if (!isValidMoveNotation(moveNotation)) {
    throw `illegal move notation (${moveNotation})`;
  }

  const moves = moveNotation.toLowerCase().split('-');

  if (!isShoreCell(game.board, game.player, moves[0])) {
    throw `illegal move (${moveNotation})`;
  }

  const togglePlayer = () => game.player = game.player === Player.South ? Player.North : Player.South;

  const updateCells = (start: Coordinate, end: Coordinate) => {
    const piece = game.board[start.x][start.y];
    game.board[start.x][start.y] = 0;
    game.board[end.x][end.y] = piece;
  };

  const moveLength = moves.length;
  const first = getCoordinates(game.board, moves[0]);
  const last = getCoordinates(game.board, moves[moveLength - 1]);
  const secondToLast = getCoordinates(game.board, moves[moveLength - 2]);

  if (moveLength === 2) {

    if (!canBouncePiece(game.player, game.board, moves[0])) {
      throw `illegal move notation (${moveNotation})`;
    }

    if (!isValidBounce(game.board, first, last)) {
      throw `illegal move notation (${moveNotation})`;
    }

    if (!isCellEmpty(game.board, last.x, last.y)) {
      throw `illegal move notation (${moveNotation})`;
    }

    updateCells(first, last);

    togglePlayer();

    return game;
  }

  let count = 1;
  let replace = false;
  const bounce = () => {
    if (moves.length >= count) {
      const start = getCoordinates(game.board, moves[0]);
      const end = getCoordinates(game.board, moves[1]);

      if (!canBouncePiece(game.player, game.board, moves[0])) {
        throw `illegal move notation (${moveNotation})`;
      }

      replace = !isValidBounce(game.board, start, end);

      if (replace && moves.length !== 2) {
        throw `illegal move notation (${moveNotation})`;
      }

      if (replace) {
        if (!isCellEmpty(game.board, end.x, end.y)) {
          throw `illegal move notation (${moveNotation})`;
        }

        const opponent = game.player === Player.North ? Player.South : Player.North;
        const shoreCell = getShoreCells(game.board, opponent)[0];
        const coords = getCoordinates(game.board, shoreCell);
        const invalidReplace = opponent === Player.North ? end.y > coords.y : end.y < coords.y;

        if (invalidReplace) {
          throw `illegal move notation (${moveNotation})`;
        }

        updateCells(first, start);
        updateCells(start, end);
      } else if (moves.length === 2) {
        updateCells(first, end);
      }

      count++;
      moves.shift();
      bounce();
    }
  };

  bounce();
  togglePlayer();

  return game;
}
