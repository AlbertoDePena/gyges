import { Piece } from './enums';

const buildCellName = (x: number, y: number): string => {
    const col = String.fromCharCode('a'.charCodeAt(0) + x);
    const row = y + 1;

    return `${col}${row}`;
};

export const Cells = [
    'a6', 'b6', 'c6', 'd6', 'e6', 'f6',
    'a5', 'b5', 'c5', 'd5', 'e5', 'f5',
    'a4', 'b4', 'c4', 'd4', 'e4', 'f4',
    'a3', 'b3', 'c3', 'd3', 'e3', 'f3',
    'a2', 'b2', 'c2', 'd2', 'e2', 'f2',
    'a1', 'b1', 'c1', 'd1', 'e1', 'f1',
];

export class Cell {
    private _name: string;

    private _piece: Piece;

    private _x: number;

    private _y: number;

    constructor(x: number, y: number, piece?: Piece) {
        if (x < 0 || x > 5) { throw `x coord must be between 0 and 5`; }
        if (y < 0 || y > 5) { throw `y coord must be between 0 and 5`; }

        this._x = x;
        this._y = y;
        this._name = buildCellName(x, y);
        this._piece = piece;
    }

    public get piece() {
        if (this.isEmpty()) { throw 'cannot access piece for an empty cell'; }

        return this._piece;
    }

    public get name() { return this._name; }

    public isEmpty() { return this.value === 0; }

    public get value() { return <number>this._piece || 0; }

    public get x() { return this._x; }

    public get y() { return this._y; }
}