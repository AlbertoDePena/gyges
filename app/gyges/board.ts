import { Cells } from './cell';
import { Move } from './move';
import { Piece, MoveType, Player } from './enums';
import { Cell } from './cell';

const initCells = (): Cell[] => {
    const cells = [];
    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 6; x++) {
            cells.push(new Cell(x, y));
        }
    }
    return cells;
};

const initBoard = (): number[][] => {
    const board = [];
    for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 6; x++) {
            board.push([x, y]);
        }
    }
    return board;
};

const validateBoard = (board: Board): void => {
    const validateCell = (cell: Cell) => {
        const invalid = Cells.filter(name => name === cell.name).length > 1;

        if (invalid) { throw 'Board cells must have columns A-F with rows 1-6'; }
    };

    board.cells.forEach(validateCell);
};

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

const getActiveCells = (player: Player, cells: Cell[], increment: number) => {
    const index = increment ? increment : 0;
    const coords = cells.map(cell => cell.y);
    const ycoord =
        player === Player.North ?
            Math.max(...coords) - index : Math.min(...coords) + index;

    return cells.filter(cell => !cell.isEmpty() && cell.y === ycoord);
};

const isCellEmpty = (cells: Cell[], x: number, y: number) => {
    if (x > 5 || x < 0) { return true; }
    if (y > 5 || y < 0) { return true; }
    const target = cells.filter(cell => cell.x === x && cell.y === y)[0];
    if (!target) { throw `no cell found for coords ${x}:${y}`; }
    return target.isEmpty();
};

const calculateY =
    (player: Player, cell: Cell, increment: number) => player === Player.North ? cell.y - increment : cell.y + increment;

const validateMove = (player: Player, from: Cell, to: Cell, replace?: Cell): void => {

};

export class Board {

    private _cells: Cell[];

    constructor(northSetup: Piece[], southSetup: Piece[]) {
        validatePlayerSetup(northSetup);
        validatePlayerSetup(southSetup);

        const that = this;

        that._cells = initCells();

        northSetup.forEach((piece, index) => {
            that._cells[index + 30] = new Cell(index, 5, piece);
        });

        southSetup.forEach((piece, index) => {
            that._cells[index] = new Cell(index, 0, piece);
        });

        validateBoard(that);
    }

    public get cells(): Cell[] { return this._cells; }

    public makeMove(move: Move, player: Player) {
        const isSelectableCell = this.getSelectableCells(player).filter(name => name === move.from).length > 0;
        if (!isSelectableCell) { throw `invalid move (${move.toNotation()})`; }

        const isReplace = move.replace ? true : false;
        const from = this._cells.filter(x => x.name === move.from)[0];
        const to = this._cells.filter(x => x.name === move.to)[0];

        let replace: Cell;
        if (isReplace) {
            replace = this._cells.filter(x => x.name === move.replace)[0];
        }

        const invalid = !from || !to || (isReplace && !replace);
        if (invalid) { throw `invalid move (${move.toNotation()})`; }

        validateMove(player, from, to, replace);

        const fromIndex = this._cells.indexOf(from);
        const toIndex = this._cells.indexOf(to);

        this._cells[fromIndex] = new Cell(from.x, from.y);
        if (isReplace) {
            const replaceIndex = this._cells.indexOf(replace);

            this._cells[replaceIndex] = new Cell(replace.x, replace.y, from.piece);
            this._cells[toIndex] = new Cell(to.x, to.y, replace.piece);
        } else {
            this._cells[toIndex] = new Cell(to.x, to.y, from.piece);
        }
    }

    public getSelectableCells(player: Player): string[] {
        const cells = this.cells;

        // Piece cannot move through piece
        const canMove = (cell: Cell) => {
            switch (cell.piece) {
                case Piece.Single: return true;
                case Piece.Double:
                    return isCellEmpty(cells, cell.x, calculateY(player, cell, 1));
                case Piece.Triple:
                    if (!isCellEmpty(cells, cell.x, calculateY(player, cell, 1))) { return false; }

                    const checkRight = isCellEmpty(cells, cell.x + 1, calculateY(player, cell, 1));
                    const checkLeft = isCellEmpty(cells, cell.x - 1, calculateY(player, cell, 1));
                    if (checkRight || checkLeft) { return true; }

                    return isCellEmpty(cells, cell.x, calculateY(player, cell, 2));
                default: return false;
            }
        };

        // If none of the pieces can be moved (very rare) then use selectable pieces in the next row
        let increment = 0;
        const selectableCells = () => {
            const data =
                getActiveCells(player, cells, increment)
                    .filter(canMove)
                    .map(cell => cell.name);

            increment++;
            return data.length > 0 ? data : selectableCells();
        };

        return selectableCells();
    }

    public print(): void {
        const getCell = (x: number, y: number) => this._cells.filter(cell => cell.x === x && cell.y === y)[0];

        console.log('   NORTH');
        console.log('     0');

        let row = '';
        for (let y = 5; y >= 0; y--) {
            for (let x = 0; x < 6; x++) {
                row += `${getCell(x, y).value} `;
            }
            console.log(row);
            row = '';
        }

        console.log('     0');
        console.log('   SOUTH');
    }
}