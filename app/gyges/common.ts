import { Game, Coordinate, Player, GameStatus, MoveNotation } from './models';

export const togglePlayer = (game: Game): Player =>
  (game.player = game.player === Player.South ? Player.North : Player.South);

export const toggleGameState = (game: Game, coordinate: Coordinate): void => {
  game.winningPiece = game.board[coordinate.x][coordinate.y];
  game.board[coordinate.x][coordinate.y] = 0;
  game.status =
    game.player === Player.North ? GameStatus.NorthWon : GameStatus.SouthWon;
};

export const parseMoveNotation = (notation: string): MoveNotation => {
  const data = notation.toUpperCase();
  const match =
    (data.match(/^([A-F][1-6]-)+[A-F][1-6](-G){0,1}$/g) || []).length === 1;
  if (!match) {
    throw `illegal move notation - ${notation}`;
  }
  const moves = data.split('-');
  const isWinMove = moves.indexOf('G') !== -1;
  if (isWinMove) {
    moves.pop();
  }
  return {
    moves: moves,
    length: moves.length,
    first: moves[0],
    last: moves[moves.length - 1],
    replace: moves[moves.length - 2],
    isWinMove: isWinMove
  };
};

export const getCoordinate = (board: number[][], cell: string): Coordinate => {
  const data = cell.toUpperCase().split('');
  const x = data[0].charCodeAt(0) - 65;
  const y = parseInt(data[1], null) - 1;
  return { x: x, y: y };
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

export const getShoreCells = (player: Player, board: number[][]): string[] => {
  const buildCellName = (x: number, y: number) => {
    const col = String.fromCharCode('A'.charCodeAt(0) + x);
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
): boolean => getShoreCells(player, board).filter(x => x === cell).length > 0;

export const getGameStatus = (game: Game): string =>
  game.status !== GameStatus.InProgress
    ? `Game Over - ${game.player} won!`
    : `${game.player}'s turn`;

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
