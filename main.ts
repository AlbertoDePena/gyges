import { printBoard, newGame, getGameStatus } from './app/gyges/common';
import { Game, Player } from './app/gyges/models';
import { makeMove } from './app/gyges/engine';

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
    let game = newGame('212331', '313212', Player.South);

    print(game);

    game = play(game, 'a1-a4');
    game = play(game, 'f6-f5');
    game = play(game, 'b1-a1');
    game = play(game, 'a6-a4-a1-g');
    /*game = play(game, 'c1-d3');
    /*game = play(game, 'd6-c4');*/

    return 0;
  }
}

Program.main();
