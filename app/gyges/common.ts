import { Player, Coordinate, Piece, Game } from './models';

export const getShoreCells = (player: Player, board: number[][]): string[] => {
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

export const isShoreCell = (
  player: Player,
  board: number[][],
  cell: string
): boolean => {
  return getShoreCells(player, board).filter(x => x === cell).length > 0;
};

export const isEmptyCell = (
  board: number[][],
  x: number,
  y: number
): boolean => {
  if (x > 5 || x < 0) {
    return false;
  }
  if (y > 5 || y < 0) {
    return false;
  }
  return board[x][y] === 0;
};

export const getCoordinate = (board: number[][], cell: string): Coordinate => {
  const data = cell.toUpperCase().split('');
  const x = data[0].charCodeAt(0) - 65;
  const y = parseInt(data[1], null) - 1;
  return { x: x, y: y };
};

export const getCellValueByName = (board: number[][], cell: string): number => {
  const coordinate = getCoordinate(board, cell);
  return board[coordinate.x][coordinate.y];
};

export const calculateY = (
  player: Player,
  coordinate: Coordinate,
  increment: number
): number => {
  return player === Player.North
    ? coordinate.y - increment
    : coordinate.y + increment;
};

export const printBoard = (board: number[][]): void => {
  console.log('   NORTH');
  console.log('     0');
  let row = '';
  for (let y = 5; y >= 0; y--) {
    for (let x = 0; x < 6; x++) {
      row += `${board[x][y]} `;
    }
    console.log(row);
    row = '';
  }
  console.log('     0');
  console.log('   SOUTH');
};

export const newGame = (north: string, south: string, player: Player): Game => {
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
    player: player,
    board: initBoard()
  };

  for (let x = 0; x < 6; x++) {
    game.board[x][0] = southSetup[x];
    game.board[x][5] = northSetup[x];
  }

  return game;
};

export const canMove = (
  board: number[][],
  player: Player,
  from: string,
  to: string
): boolean => {
  const coordinate = getCoordinate(board, to);
  return (
    getPossibleMoves(board, player, from).filter(
      coord => coord.x === coordinate.x && coord.y === coordinate.y
    ).length > 0
  );
};

export const getPossibleMoves = (
  board: number[][],
  player: Player,
  cell: string
): Coordinate[] => {
  const coordinate = getCoordinate(board, cell);
  const buildCoordinate = (x: number, y: number): Coordinate => {
    return { x: x, y: y };
  };
  let result: Coordinate[] = [];
  switch (getCellValueByName(board, cell)) {
    case Piece.Single:
      result = [
        buildCoordinate(coordinate.x, calculateY(player, coordinate, 1))
      ];
      break;
    case Piece.Double:
      result = [
        buildCoordinate(coordinate.x, calculateY(player, coordinate, 2)),
        buildCoordinate(coordinate.x + 1, calculateY(player, coordinate, 1)),
        buildCoordinate(coordinate.x - 1, calculateY(player, coordinate, 1))
      ];
      break;
    case Piece.Triple:
      result = [
        buildCoordinate(coordinate.x, calculateY(player, coordinate, 3)),
        buildCoordinate(coordinate.x + 1, calculateY(player, coordinate, 2)),
        buildCoordinate(coordinate.x - 1, calculateY(player, coordinate, 2)),
        buildCoordinate(coordinate.x + 2, calculateY(player, coordinate, 1)),
        buildCoordinate(coordinate.x - 2, calculateY(player, coordinate, 1))
      ];
      break;
    default:
      break;
  }
  // return result.filter(coord => isEmptyCell(board, coord.x, coord.y));
  return result;
};

export const getPossMoves = (board: number[][], cell: string): Coordinate[] => {
  return [];
};

export const isMoveValid = (
  board: number[][],
  from: string,
  to: string
): boolean => {
  const fromCoord = getCoordinate(board, from);
  const toCoord = getCoordinate(board, to);
  const piece = board[fromCoord.x][fromCoord.y];

  switch (piece) {
    case Piece.Single:
      return isMoveValidForSingle(board, fromCoord, toCoord);
    case Piece.Double:
      return isMoveValidForDouble(board, fromCoord, toCoord);
    case Piece.Triple:
      return isMoveValidForTriple(board, fromCoord, toCoord);
    default:
      return false;
  }
};

export const isMoveValidForSingle = (
  board: number[][],
  from: Coordinate,
  to: Coordinate
) => {
  const x = to.x - from.x;
  const y = to.y - from.y;

  if (x === 0 && y === 0) {
    throw 'Invalid move';
  }

  return Math.abs(x) + Math.abs(y) === 1;
};

export const isMoveValidForDouble = (
  board: number[][],
  from: Coordinate,
  to: Coordinate
): boolean => {
  const x = to.x - from.x;
  const y = to.y - from.y;

  if (x === 0 && y === 0) {
    throw 'Invalid move';
  }

  const canBounce = Math.abs(x) + Math.abs(y) === 2;
  const north = isEmptyCell(board, from.x, from.y + 1) && canBounce;
  const south = isEmptyCell(board, from.x, from.y - 1) && canBounce;
  const east = isEmptyCell(board, from.x + 1, from.y) && canBounce;
  const west = isEmptyCell(board, from.x - 1, from.y) && canBounce;

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

export const isMoveValidForTriple = (
  board: number[][],
  from: Coordinate,
  to: Coordinate
) => {
  const x = to.x - from.x;
  const y = to.y - from.y;

  if (x === 0 && y === 0) {
    throw 'Invalid move';
  }

  const check = (incX: number, incY: number) => isEmptyCell(board, from.x + incX, from.y + incY);
  const north = check(0, 1) && check(0, 2);
  const south = check(0, -1) && check(0, -2);
  const east = check(1, 0) && check(2, 0);
  const west = check(-1, 0) && check(-2, 0);

  if (x === 0) {
    if (y === 3) {
      return north;
    }
    if (y === -3) {
      return south;
    }
    if (y === 1) {
      return ((check(1, 0) && check(1, 1)) || (check(-1, 0) && check(-1, 1)));
    }
    if (y === -1) {
      return ((check(1, 0) && check(1, -1)) || (check(-1, 0) && check(-1, -1)));
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
      return ((check(0, 1) && check(1, 1)) || (check(0, -1) && check(1, -1)));
    }
    if (x === -1) {
      return ((check(0, 1) && check(-1, 1)) || (check(0, -1) && check(-1, -1)));
    }
  }

  if (x === 1 && y === 2) {
    return (north || (check(0, 1) && check(1, 1)) || (check(1, 0) && check(1, 1)));
  }
  if (x === 2 && y === 1) {
    return (check(0, 1) && check(1, 1)) || (check(1, 0) && check(1, 1) || east);
  }
  if (x === 2 && y === -1) {
    return (east || (check(1, 0) && check(1, -1)) || (check(0, -1) && check(1, -1)));
  }
  if (x === 1 && y === -2) {
    return (check(1, 0) && check(1, -1)) || (check(0, -1) && check(1, -1) || south);
  }
  if (x === -1 && y === -2) {
    return (south || (check(0, -1) && check(-1, -1)) || (check(-1, 0) && check(-1, -1)));
  }
  if (x === -2 && y === -1) {
    return (west || (check(0, -1) && check(-1, -1)) || (check(-1, 0) && check(-1, -1)));
  }
  if (x === -2 && y === 1) {
    return (west || (check(-1, 0) && check(-1, 1)) || (check(0, 1) && check(-1, 1)));
  }
  if (x === -1 && y === 2) {
    return (north || (check(0, 1) && check(-1, 1)) || (check(-1, 0) && check(-1, 1)));
  }

  return false;
};
