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

export interface Coordinate {
  x: number;
  y: number;
}

export interface Cell {
  name: string;
  piece?: Piece;
  value: number;
  coordinate: Coordinate;
}

export interface Move {
  notation: string;
  from: string;
  to: string;
  replace?: string;
}

export interface Board {
  cells: Cell[];
}

export interface Game {
  player: Player;
  board: Board;
}
