export enum Piece {
  Single = 1,
  Double = 2,
  Triple = 3
}

export enum Player {
  North = 'NORTH',
  South = 'SOUTH'
}

export enum GameStatus {
  InProgress = 0,
  NorthWon = 1,
  SouthWon = 2
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Game {
  player: Player;
  board: number[][];
  status: GameStatus;
  winningPiece: number;
}

const MOVE_NOTATION = /^([abcdefg][123456]-)+[abcdefg][123456](-g){0,1}$/g;

const isValidMoveNotation = (notation: string): boolean => {
  return (notation.toLowerCase().match(MOVE_NOTATION) || []).length === 1;
};

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
  const isValidBounce = Math.abs(x) + Math.abs(y) === 2;

  if (x === 0 && y === 0) {
    return false;
  }

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
  const isEmpty = (incX: number, incY: number) =>
    isEmptyCell(board, from.x + incX, from.y + incY);

  if (x === 0 && y === 0) {
    return false;
  }

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

const getCoordinate = (board: number[][], cell: string): Coordinate => {
  const data = cell.toUpperCase().split('');
  const x = data[0].charCodeAt(0) - 65;
  const y = parseInt(data[1], null) - 1;
  return { x: x, y: y };
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

const isEmptyCell = (board: number[][], x: number, y: number): boolean => {
  if (x > 5 || x < 0) {
    return false;
  }
  if (y > 5 || y < 0) {
    return false;
  }
  return board[x][y] === 0;
};

const getShoreCells = (player: Player, board: number[][]): string[] => {
  const buildCellName = (x: number, y: number) => {
    const col = String.fromCharCode('a'.charCodeAt(0) + x);
    const row = y + 1;
    return `${col}${row}`;
  };
  const find = (increment: number) => {
    const cells = [];
    const y = player === Player.North ? 5 - increment : 0 + increment;
    for (let x = 0; x < 6; x++) {
      if (board[x][y] !== 0) {
        cells.push(buildCellName(x, y));
      }
    }
    return cells.length > 0 ? cells : find(increment + 1);
  };
  return find(0);
};

const isShoreCell = (
  player: Player,
  board: number[][],
  cell: string
): boolean => {
  return getShoreCells(player, board).filter(x => x === cell).length > 0;
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

  const toggleState = (coordinate: Coordinate, piece: Piece) => {
    game.winningPiece = piece;
    game.board[coordinate.x][coordinate.y] = 0;
    game.status =
      game.player === Player.North ? GameStatus.NorthWon : GameStatus.SouthWon;
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

  const first = getCoordinate(game.board, moves[0]);
  const last = getCoordinate(game.board, moves[moveLength - 1]);

  if (isWinMove) {
    if (!isWinMoveValid(game.player, game.board, last)) {
      throw `illegal move (${moveNotation})`;
    }

    toggleState(first, game.board[first.x][first.y]);
  } else if (isEmptyCell(game.board, last.x, last.y)) {
    updateCells(moves[0], moves[moveLength - 1]);
    togglePlayer();
  } else {
    throw `illegal move (${moveNotation})`;
  }

  return game;
}

export const printBoard = (game: Game): void => {
  const getStatus = (player: Player) => {
    switch (game.status) {
      case GameStatus.NorthWon:
        return player === Player.North ? game.winningPiece : '0';
      case GameStatus.SouthWon:
        return player === Player.South ? game.winningPiece : '0';
      default:
        return '0';
    }
  };
  console.log('   NORTH');
  console.log(`     ${getStatus(Player.South)}`);
  let row = '';
  for (let y = 5; y >= 0; y--) {
    for (let x = 0; x < 6; x++) {
      row += `${game.board[x][y]} `;
    }
    console.log(row);
    row = '';
  }
  console.log(`     ${getStatus(Player.North)}`);
  console.log('   SOUTH');
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

export const getGameStatus = (game: Game) =>
  game.status !== GameStatus.InProgress
    ? `Game Over - ${game.player} won!`
    : `${game.player}'s turn`;
