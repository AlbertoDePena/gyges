export enum Piece {
  Single = 1,
  Double = 2,
  Triple = 3
}

export enum Player {
  North = 'NORTH',
  South = 'SOUTH'
}

export enum GameStatus {
  InProgress = 0,
  NorthWon = 1,
  SouthWon = 2
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface Game {
  player: Player;
  board: number[][];
}
