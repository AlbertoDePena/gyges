import { Cells } from './cell';
import { MoveType } from './enums';

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

export class Move {
    private _moveType: MoveType;

    private _from: string;

    private _to: string;

    private _replace: string;

    private _notation: string;

    constructor(moveNotation: string) {
        const cellNames = validateMoveNotation(moveNotation);

        this._notation = moveNotation;
        this._from = cellNames[0];
        this._to = cellNames.length === 2 ? cellNames[1] : cellNames[2];
        this._replace = cellNames.length === 3 ? cellNames[1] : '';

        validateCellNames(this);
    }

    public get moveType() { return this._replace ? MoveType.Replace : MoveType.Bounce; }

    public get from() { return this._from.toLowerCase(); }

    public get to() { return this._to.toLowerCase(); }

    public get replace() { return this._replace.toLowerCase(); }

    public toNotation() { return this._notation.toLowerCase(); }
}