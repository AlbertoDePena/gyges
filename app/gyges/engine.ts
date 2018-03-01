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
  if (!setup) { throw 'null arg (player setup)'; }
  if (setup.length !== 6) { throw 'There must be exactly 6 pieces'; }

  const validate = (piece: Piece) => {
    if (setup.filter(x => x === piece).length !== 2) { throw `Invalid # of ${piece} pieces`; }
  };

  validate(Piece.Single);
  validate(Piece.Double);
  validate(Piece.Triple);
};

const validateBoard = (board: Board): void => {
  const validateCell = (cell: Cell) => {
    const invalid = Cells.filter(name => name === cell.name).length > 1;

    if (invalid) { throw 'invalid board cells'; }
  };

  board.cells.forEach(validateCell);
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

const buildCell = (x: number, y: number, piece?: Piece) => {
  return {
    name: buildCellName(x, y),
    piece: piece,
    value: piece || 0,
    coordinate: { x: x, y: y }
  } as Cell;
};

const isCellEmpty = (cells: Cell[], x: number, y: number): boolean => {
  if (x > 5 || x < 0) { return true; }
  if (y > 5 || y < 0) { return true; }
  const target = cells.filter(cell => cell.coordinate.x === x && cell.coordinate.y === y)[0];
  const isEmpty = (cell: Cell) => cell.value === 0;
  return target ? isEmpty(target) : true;
};

const calculateY = (player: Player, cell: Cell, increment: number): number => {
  return player === Player.North ? cell.coordinate.y - increment : cell.coordinate.y + increment;
};

const validateMove = (player: Player, from: Cell, to: Cell, replace?: Cell): boolean => {
  switch (from.piece) {
    case Piece.Single: return true;
    case Piece.Double: return true;
    case Piece.Triple: return true;
    default: return false;
  }
};

const validateCellNames = (move: Move) => {
  let found = Cells.filter(name => name === move.from).length > 0;
  if (!found) { throw `Invalid move name ${move.from}`; }

  found = Cells.filter(cell => cell === move.to).length > 0;
  if (!found) { throw `Invalid move name ${move.to}`; }

  if (move.replace) {
    found = Cells.filter(cell => cell === move.replace).length > 0;
    if (!found) { throw `Invalid move name ${move.replace}`; }
  }
};

const validateMoveNotation = (moveNotation: string) => {
  if (!moveNotation) { throw 'moveNotation is null or empty'; }

  const cellNames = moveNotation.split('-');
  if (cellNames.length < 2 || cellNames.length > 3) { throw 'move notation should be 2 cells for BOUNCE and 3 cells for REPLACE'; }

  return cellNames;
};

const buildMove = (notation: string): Move => {
  const cellNames = validateMoveNotation(notation);

  const from = cellNames[0];
  const to = cellNames.length === 2 ? cellNames[1] : cellNames[2];
  const replace = cellNames.length === 3 ? cellNames[1] : '';

  const move: Move = {
    notation: notation.toLowerCase(),
    from: from.toLowerCase(),
    to: to.toLowerCase(),
    replace: replace.toLowerCase()
  };

  validateCellNames(move);

  return move;
};

export function findCell(board: Board, x: number, y: number): Cell {
  const byCoordinates = (cell: Cell) => cell.coordinate.x === x && cell.coordinate.y === y;
  return board.cells.filter(byCoordinates)[0];
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

export function buildCellName(x: number, y: number): string {
  const col = String.fromCharCode('a'.charCodeAt(0) + x);
  const row = y + 1;

  return `${col}${row}`;
}

export function initCells(): Cell[] {
  const cells = [];
  let cell: Cell;
  let coords: Coordinate;
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 6; x++) {
      cell = {
        name: buildCellName(x, y),
        value: 0,
        coordinate: { x: x, y: y }
      };
      cells.push(cell);
    }
  }
  return cells;
}

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

  validateBoard(game.board);

  return game;
}

export function getSelectableCells(board: Board, player: Player): string[] {
  const cells = board.cells;

  // Piece cannot move through piece
  const canMove = (cell: Cell) => {
    switch (cell.piece) {
      case Piece.Single: return true;
      case Piece.Double:
        return isCellEmpty(cells, cell.coordinate.x, calculateY(player, cell, 1));
      case Piece.Triple:
        if (!isCellEmpty(cells, cell.coordinate.x, calculateY(player, cell, 1))) { return false; }

        const checkRight = isCellEmpty(cells, cell.coordinate.x + 1, calculateY(player, cell, 1));
        const checkLeft = isCellEmpty(cells, cell.coordinate.x - 1, calculateY(player, cell, 1));
        if (checkRight || checkLeft) { return true; }

        return isCellEmpty(cells, cell.coordinate.x, calculateY(player, cell, 2));
      default: return false;
    }
  };

  // If none of the pieces can be moved (very rare) then use selectable pieces in the next row
  let increment = 0;
  const selectableCells = () => {
    const data =
      getActiveCells(player, board, increment)
        .filter(canMove)
        .map(cell => cell.name);

    increment++;
    return data.length > 0 ? data : selectableCells();
  };

  return selectableCells();
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

  validateMove(game.player, from, to, replace);

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
