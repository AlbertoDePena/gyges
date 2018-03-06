import {
  Game,
  makeMove,
  printBoard,
  newGame,
  getGameStatus
} from './app/gyges/engine';

const print = (game: Game): void => {
  printBoard(game);
  console.log('');
  console.log(getGameStatus(game));
  console.log('');
};

const play = (game: Game, move: string): Game => {
  makeMove(game, move);
  print(game);
  return game;
};

class Program {
  public static main(): number {
    let game = newGame('113223', '321213');

    print(game);

    game = play(game, 'a1-b3');
    game = play(game, 'b6-b5');
    game = play(game, 'd1-e2');
    game = play(game, 'c6-d4');
    game = play(game, 'b1-c2');
    game = play(game, 'f6-f3');
    game = play(game, 'e1-e2-f3-f6');
    // game = play(game, 'd6-d4-e2-f1-g');
    // game = play(game, 'd6-d4-e2-g');
    game = play(game, 'd6-d4-e2-f1-c1-g');

    return 0;
  }
}

Program.main();
