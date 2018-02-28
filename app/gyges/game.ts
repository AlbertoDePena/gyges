import { Move } from './move';
import { Board } from './board';
import { Player, Piece, MoveType } from './enums';

export class Game {

    private _player: Player;

    private _board: Board;

    constructor(northSetup: Piece[], southSetup: Piece[], player: Player) {
        this._player = player;
        this._board = new Board(northSetup, southSetup);
    }

    public get player() { return this._player; }

    public get board() { return this._board; }

    public getStatus() { }

    public makeMove(moveNotation: string) {
        this._board.makeMove(new Move(moveNotation), this._player);
        this._player = this._player === Player.South ? Player.North : Player.South;
    }
}