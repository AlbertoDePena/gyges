import { Coordinate, Player, Piece, Game, GameStatus } from './models';
import {
  getCoordinate,
  parseMoveNotation,
  isShoreCell,
  isEmptyCell,
  toggleGameState,
  togglePlayer
} from './common';

const isMoveValidForSingle = (
  board: number[][],
  from: Coordinate,
  to: Coordinate
) => {
  const x = to.x - from.x;
  const y = to.y - from.y;

  if (x === 0 && y === 0) {
    return false;
  }

  return Math.abs(x) + Math.abs(y) === 1;
};

const isMoveValidForDouble = (
  board: number[][],
  from: Coordinate,
  to: Coordinate
): boolean => {
  const x = to.x - from.x;
  const y = to.y - from.y;

  if (x === 0 && y === 0) {
    return false;
  }

  const isValidBounce = Math.abs(x) + Math.abs(y) === 2;
  const north = isEmptyCell(board, from.x, from.y + 1) && isValidBounce;
  const south = isEmptyCell(board, from.x, from.y - 1) && isValidBounce;
  const east = isEmptyCell(board, from.x + 1, from.y) && isValidBounce;
  const west = isEmptyCell(board, from.x - 1, from.y) && isValidBounce;

  if (x === 0) {
    return y > 0 ? north : south;
  }
  if (y === 0) {
    return x > 0 ? east : west;
  }
  if (y > 0) {
    return x > 0 ? north || east : north || west;
  }
  if (y < 0) {
    return x > 0 ? south || east : south || west;
  }

  return false;
};

const isMoveValidForTriple = (
  board: number[][],
  from: Coordinate,
  to: Coordinate
) => {
  const x = to.x - from.x;
  const y = to.y - from.y;

  if (x === 0 && y === 0) {
    return false;
  }

  const isEmpty = (incX: number, incY: number) =>
    isEmptyCell(board, from.x + incX, from.y + incY);

  const north = isEmpty(0, 1) && isEmpty(0, 2);
  const south = isEmpty(0, -1) && isEmpty(0, -2);
  const east = isEmpty(1, 0) && isEmpty(2, 0);
  const west = isEmpty(-1, 0) && isEmpty(-2, 0);
  const northeast = isEmpty(0, 1) && isEmpty(1, 1);
  const northwest = isEmpty(0, 1) && isEmpty(-1, 1);
  const southeast = isEmpty(0, -1) && isEmpty(1, -1);
  const southwest = isEmpty(0, -1) && isEmpty(-1, -1);
  const eastnorth = isEmpty(1, 0) && isEmpty(1, 1);
  const eastsouth = isEmpty(1, 0) && isEmpty(1, -1);
  const westnorth = isEmpty(-1, 0) && isEmpty(-1, 1);
  const westsouth = isEmpty(-1, 0) && isEmpty(-1, -1);

  if (x === 0) {
    if (y === 3) {
      return north;
    }
    if (y === -3) {
      return south;
    }
    if (y === 1) {
      return eastnorth || westnorth;
    }
    if (y === -1) {
      return eastsouth || westsouth;
    }
  }
  if (y === 0) {
    if (x === 3) {
      return east;
    }
    if (x === -3) {
      return west;
    }
    if (x === 1) {
      return northeast || southeast;
    }
    if (x === -1) {
      return northwest || southwest;
    }
  }

  if (x === 1 && y === 2) {
    return north || northeast || eastnorth;
  }
  if (x === -1 && y === 2) {
    return north || northwest || westnorth;
  }
  if (x === 2 && y === 1) {
    return east || eastnorth || northeast;
  }
  if (x === 2 && y === -1) {
    return east || eastsouth || southeast;
  }
  if (x === 1 && y === -2) {
    return south || southeast || eastsouth;
  }
  if (x === -1 && y === -2) {
    return south || southwest || westsouth;
  }
  if (x === -2 && y === -1) {
    return west || southwest || westsouth;
  }
  if (x === -2 && y === 1) {
    return west || westnorth || northwest;
  }

  return false;
};

const isWinMoveValid = (
  player: Player,
  board: number[][],
  coordinate: Coordinate
): boolean => {
  const x = coordinate.x;
  const y = coordinate.y;
  const piece = board[x][y];
  const isEmpty = (xcoord: number, ycoord: number) =>
    isEmptyCell(board, xcoord, ycoord);

  switch (piece) {
    case Piece.Single:
      return true;
    case Piece.Double:
      if (y === 0 || y === 5) {
        return isEmpty(x + 1, y) || isEmpty(x - 1, y);
      }
      if (y === 1) {
        return isEmpty(x, y - 1);
      }
      if (y === 4) {
        return isEmpty(x, y + 1);
      }
      return false;
    case Piece.Triple:
      if (y === 0 || y === 5) {
        return (
          (isEmpty(x + 1, y) && isEmpty(x + 2, y)) ||
          (isEmpty(x - 1, y) && isEmpty(x - 2, y))
        );
      }
      if (y === 1) {
        return (
          (isEmpty(x, y - 1) && isEmpty(x + 1, y - 1)) ||
          (isEmpty(x, y - 1) && isEmpty(x - 1, y - 1)) ||
          (isEmpty(x + 1, y) && isEmpty(x + 1, y - 1)) ||
          (isEmpty(x - 1, y) && isEmpty(x - 1, y - 1))
        );
      }
      if (y === 2) {
        return isEmptyCell(board, x, y - 1) && isEmptyCell(board, x, y - 2);
      }
      if (y === 4) {
        return (
          (isEmpty(x, y + 1) && isEmpty(x + 1, y + 1)) ||
          (isEmpty(x, y + 1) && isEmpty(x - 1, y + 1)) ||
          (isEmpty(x + 1, y) && isEmpty(x + 1, y + 1)) ||
          (isEmpty(x - 1, y) && isEmpty(x - 1, y + 1))
        );
      }
      if (y === 3) {
        return isEmpty(x, y + 1) && isEmpty(x, y + 2);
      }
      return false;
    default:
      return false;
  }
};

const isMoveValid = (board: number[][], from: string, to: string): boolean => {
  const start = getCoordinate(board, from);
  const end = getCoordinate(board, to);
  const piece = board[start.x][start.y];

  switch (piece) {
    case Piece.Single:
      return isMoveValidForSingle(board, start, end);
    case Piece.Double:
      return isMoveValidForDouble(board, start, end);
    case Piece.Triple:
      return isMoveValidForTriple(board, start, end);
    default:
      return false;
  }
};

const isReplaceMoveValid = (
  player: Player,
  board: number[][],
  coordinate: Coordinate
): boolean => {
  const find = (increment: number): Coordinate[] => {
    const coordinates = [];
    const y = player === Player.North ? 5 - increment : 0 + increment;
    for (let x = 0; x < 6; x++) {
      if (board[x][y] !== 0) {
        coordinates.push({ x: x, y: y });
      }
    }
    return coordinates.length > 0 ? coordinates : find(increment + 1);
  };
  const shoreCoordinate = find(0)[0];
  if (!shoreCoordinate) {
    return false;
  }
  const isValid =
    player === Player.North
      ? shoreCoordinate.y >= coordinate.y
      : shoreCoordinate.y <= coordinate.y;
  return isValid;
};

export const makeMove = (game: Game, notation: string): Game => {
  if (game.status !== GameStatus.InProgress) {
    return;
  }

  const moveNotation = parseMoveNotation(notation);

  if (!isShoreCell(game.player, game.board, moveNotation.first)) {
    throw `illegal move - ${notation}`;
  }

  let isReplaceMove = false;
  const validateBounce = (count: number) => {
    if (moveNotation.length - 1 > count) {
      const from = moveNotation.moves[count];
      const to = moveNotation.moves[count + 1];

      if (!isMoveValid(game.board, from, to)) {
        if (moveNotation.length > 2 && moveNotation.length - 1 - count === 1) {
          isReplaceMove = true;
        } else {
          throw `illegal move - ${notation}`;
        }
      }

      validateBounce(count + 1);
    }
  };

  validateBounce(0);

  const first = getCoordinate(game.board, moveNotation.first);
  const last = getCoordinate(game.board, moveNotation.last);

  if (moveNotation.isWinMove) {
    if (!isWinMoveValid(game.player, game.board, last)) {
      throw `illegal move - ${notation}`;
    }

    toggleGameState(game, first);
  } else if (isEmptyCell(game.board, last.x, last.y)) {
    const piece = game.board[first.x][first.y];

    if (isReplaceMove) {
      if (!isReplaceMoveValid(game.player, game.board, last)) {
        throw `illegal move - ${notation}`;
      }
      const replace = getCoordinate(game.board, moveNotation.replace);
      const replacePiece = game.board[replace.x][replace.y];

      game.board[first.x][first.y] = 0;
      game.board[replace.x][replace.y] = piece;
      game.board[last.x][last.y] = replacePiece;
    } else {
      game.board[first.x][first.y] = 0;
      game.board[last.x][last.y] = piece;
    }

    togglePlayer(game);
  } else {
    throw `illegal move - ${notation}`;
  }

  return game;
};

export const newGame = (north: string, south: string): Game => {
  const initBoard = (): number[][] => {
    return [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ];
  };

  const parseSetup = (setup: string): Piece[] => {
    if (setup.length !== 6) {
      throw 'There must be exactly 6 pieces';
    }

    const result = setup.split('').map(x => parseInt(x, null));
    const validate = (piece: Piece) => {
      if (result.filter(x => x === piece).length !== 2) {
        throw `Invalid # of ${piece} pieces`;
      }
    };

    validate(Piece.Single);
    validate(Piece.Double);
    validate(Piece.Triple);

    return result;
  };

  const northSetup = parseSetup(north);
  const southSetup = parseSetup(south);

  const game: Game = {
    player: Player.South,
    board: initBoard(),
    status: GameStatus.InProgress,
    winningPiece: 0
  };

  for (let x = 0; x < 6; x++) {
    game.board[x][0] = southSetup[x];
    game.board[x][5] = northSetup[x];
  }

  return game;
};
