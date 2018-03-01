import { Board, Cell, Piece, Coordinate, Game, Player, Move } from './models';

const Cells = [
  'a6', 'b6', 'c6', 'd6', 'e6', 'f6',
  'a5', 'b5', 'c5', 'd5', 'e5', 'f5',
  'a4', 'b4', 'c4', 'd4', 'e4', 'f4',
  'a3', 'b3', 'c3', 'd3', 'e3', 'f3',
  'a2', 'b2', 'c2', 'd2', 'e2', 'f2',
  'a1', 'b1', 'c1', 'd1', 'e1', 'f1',
];

const validatePlayerSetup = (setup: Piece[]): void => {
  if (setup.length !== 6) { throw 'There must be exactly 6 pieces'; }

  const validate = (piece: Piece) => {
    if (setup.filter(x => x === piece).length !== 2) { throw `Invalid # of ${piece} pieces`; }
  };

  validate(Piece.Single);
  validate(Piece.Double);
  validate(Piece.Triple);
};

const getActiveCells = (player: Player, board: Board, increment: number): Cell[] => {
  const index = increment || 0;
  const ycoords = board.cells.map(cell => cell.coordinate.y);
  const ycoord =
    player === Player.North ?
      Math.max(...ycoords) - index : Math.min(...ycoords) + index;
  const hasValue = (cell: Cell) => cell.value > 0;
  return board.cells.filter(cell => hasValue(cell) && cell.coordinate.y === ycoord);
};

const buildCell = (x: number, y: number, piece?: Piece): Cell => {
  return {
    name: buildCellName(x, y),
    piece: piece,
    value: piece || 0,
    coordinate: { x: x, y: y }
  };
};

const isCellEmpty = (cells: Cell[], x: number, y: number): boolean => {
  if (x > 5 || x < 0) { return true; }
  if (y > 5 || y < 0) { return true; }
  const target = cells.filter(cell => cell.coordinate.x === x && cell.coordinate.y === y)[0];
  const isEmpty = (cell: Cell) => cell.value === 0;
  return target ? isEmpty(target) : false;
};

const calculateY = (player: Player, coordinate: Coordinate, increment: number): number => {
  return player === Player.North ? coordinate.y - increment : coordinate.y + increment;
};

const validateMove1 = (from: Cell, to: Cell): boolean => {
  const x = Math.abs(to.coordinate.x - from.coordinate.x);
  const y = Math.abs(to.coordinate.y - from.coordinate.y);
  return (x + y) === from.value;
};

const validateMove = (player: Player, from: Cell, to: Cell, replace?: Cell): boolean => {
  switch (from.piece) {
    case Piece.Single: return true;
    case Piece.Double: return true;
    case Piece.Triple: return true;
    default: return false;
  }
};

const validateMoveProperties = (move: Move): void => {
  let found = Cells.filter(name => name === move.from).length > 0;
  if (!found) { throw `Invalid move name ${move.from}`; }

  found = Cells.filter(cell => cell === move.to).length > 0;
  if (!found) { throw `Invalid move name ${move.to}`; }

  if (move.replace) {
    found = Cells.filter(cell => cell === move.replace).length > 0;
    if (!found) { throw `Invalid move name ${move.replace}`; }
  }
};

const parseCellNames = (notation: string): string[] => {
  const cellNames = notation.split('-');
  if (cellNames.length < 2 || cellNames.length > 3) { throw 'invalid move notation'; }
  return cellNames;
};

const buildMove = (notation: string): Move => {
  const cellNames = parseCellNames(notation);

  const from = cellNames[0];
  const to = cellNames.length === 2 ? cellNames[1] : cellNames[2];
  const replace = cellNames.length === 3 ? cellNames[1] : '';

  const move: Move = {
    notation: notation.toLowerCase(),
    from: from.toLowerCase(),
    to: to.toLowerCase(),
    replace: replace.toLowerCase()
  };

  validateMoveProperties(move);

  return move;
};

const findCell = (board: Board, x: number, y: number): Cell => {
  const byCoordinates = (cell: Cell) => cell.coordinate.x === x && cell.coordinate.y === y;
  return board.cells.filter(byCoordinates)[0];
};

const buildCellName = (x: number, y: number): string => {
  const col = String.fromCharCode('a'.charCodeAt(0) + x);
  const row = y + 1;
  return `${col}${row}`;
};

const initCells = (): Cell[] => {
  const cells = [];
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 6; x++) {
      cells.push({ name: buildCellName(x, y), value: 0, coordinate: { x: x, y: y } });
    }
  }
  return cells;
};

export function newGame(northSetup: Piece[], southSetup: Piece[], player: Player): Game {
  validatePlayerSetup(northSetup);
  validatePlayerSetup(southSetup);

  const game: Game = {
    player: player,
    board: { cells: initCells() }
  };

  northSetup.forEach((piece, index) => {
    game.board.cells[index + 30] = buildCell(index, 5, piece);
  });

  southSetup.forEach((piece, index) => {
    game.board.cells[index] = buildCell(index, 0, piece);
  });

  return game;
}

export function getSelectableCells(board: Board, player: Player): string[] {
  const canMove = (cell: Cell) => {

    const checkCoords = (incrementX: number, incrementY: number) => {
      const coords = cell.coordinate;
      return isCellEmpty(board.cells, coords.x + incrementX, calculateY(player, coords, incrementY));
    };

    switch (cell.piece) {
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

  let increment = 0;
  const findCells = () => {
    const cells =
      getActiveCells(player, board, increment)
        .filter(canMove)
        .map(cell => cell.name);

    increment++;
    return cells.length > 0 ? cells : findCells();
  };

  return findCells();
}

export function makeMove(game: Game, moveNotation: string): Game {
  const move = buildMove(moveNotation);
  const isSelectableCell = getSelectableCells(game.board, game.player).filter(name => name === move.from).length > 0;
  if (!isSelectableCell) { throw `invalid move (${move.notation})`; }

  const isReplace = move.replace ? true : false;
  const from = game.board.cells.filter(x => x.name === move.from)[0];
  const to = game.board.cells.filter(x => x.name === move.to)[0];

  let replace: Cell;
  if (isReplace) {
    replace = game.board.cells.filter(x => x.name === move.replace)[0];
  }

  const invalid = !from || !to || (isReplace && !replace);
  if (invalid) { throw `invalid move (${move.notation})`; }

  if (!validateMove1(from, to)) { throw `invalid move (${move.notation})`; }

  const fromIndex = game.board.cells.indexOf(from);
  const toIndex = game.board.cells.indexOf(to);

  game.board.cells[fromIndex] = buildCell(from.coordinate.x, from.coordinate.y);
  if (isReplace) {
    const replaceIndex = game.board.cells.indexOf(replace);

    game.board.cells[replaceIndex] = buildCell(replace.coordinate.x, replace.coordinate.y, from.piece);
    game.board.cells[toIndex] = buildCell(to.coordinate.x, to.coordinate.y, replace.piece);
  } else {
    game.board.cells[toIndex] = buildCell(to.coordinate.x, to.coordinate.y, from.piece);
  }

  game.player = game.player === Player.South ? Player.North : Player.South;

  return game;
}

export function printBoard(board: Board): void {
  console.log('   NORTH');
  console.log('     0');
  let row = '';
  for (let y = 5; y >= 0; y--) {
    for (let x = 0; x < 6; x++) {
      row += `${findCell(board, x, y).value} `;
    }
    console.log(row);
    row = '';
  }
  console.log('     0');
  console.log('   SOUTH');
}
