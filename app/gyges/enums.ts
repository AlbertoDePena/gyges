export enum Piece {
    Single = 1,
    Double = 2,
    Triple = 3
}

export enum Player {
    North = 'NORTH',
    South = 'SOUTH'
}

export enum MoveType {
    Bounce = 'BOUNCE',
    Replace = 'REPLACE'
}

export enum GameStatus {
    InProgress = 0,
    NorthWon = 1,
    SouthWon = 2
}