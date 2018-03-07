import { makeMove, newGame } from './app/gyges/engine';
import { printBoard, getGameStatus } from './app/gyges/common';
import { Game } from './app/gyges/models';

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
    game = play(game, 'b1-b3-f5');
    game = play(game, 'c6-d6-e4');
    game = play(game, 'e1-f1-c6');
    game = play(game, 'e6-f5-f2');
    game = play(game, 'c1-d1-e5');
    game = play(game, 'd6-e4-d2');
    game = play(game, 'd1-d2-d4');
    // game = play(game, 'c6-e5-d4-e4-d2-g');
    game = play(game, 'c6-d4-e4-d2-g');

    return 0;
  }
}

Program.main();
