import { Player, Coordinate, Piece, Game } from './models';

export const getShoreCells = (board: number[][], player: Player): string[] => {
  const buildCellName = (x: number, y: number): string => {
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

export const isShoreCell = (board: number[][], player: Player, cell: string): boolean => {
  return getShoreCells(board, player).filter(x => x === cell).length > 0;
};

export const getCoordinates = (board: number[][], name: string): Coordinate => {
  const data = name.toUpperCase().split('');
  const x = data[0].charCodeAt(0) - 65;
  const y = parseInt(data[1], null) - 1;
  return { x: x,  y: y };
};

export const calculateY = (player: Player, coordinate: Coordinate, increment: number): number => {
  return player === Player.North ? coordinate.y - increment : coordinate.y + increment;
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
    if (setup.length !== 6) { throw 'There must be exactly 6 pieces'; }
    return setup.split('').map(x => parseInt(x, null));
  };

  const validatePlayerSetup = (setup: Piece[]): void => {
    const validate = (piece: Piece) => {
      if (setup.filter(x => x === piece).length !== 2) { throw `Invalid # of ${piece} pieces`; }
    };

    validate(Piece.Single);
    validate(Piece.Double);
    validate(Piece.Triple);
  };

  const northSetup = parseSetup(north);
  const southSetup = parseSetup(south);

  validatePlayerSetup(northSetup);
  validatePlayerSetup(southSetup);

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
