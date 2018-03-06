import { getShoreCells, printBoard, newGame } from './app/gyges/common';
import { Game, Player, Piece } from './app/gyges/models';
import { makeMove2 } from './app/gyges/engine';

const print = (game: Game): void => {
  printBoard(game.board);
  console.log('');
  const cells = getShoreCells(game.player, game.board);
  console.log(`${game.player}: ${cells}`);
  console.log('');
};

const play = (game: Game, move: string): Game => {
  makeMove2(game, move);
  print(game);
  return game;
};

class Program {

  public static main(): number {
    let game = newGame('212331', '313212', Player.South);

    print(game);

    game = play(game, 'd1-c2');
    game = play(game, 'd6-b5');
    game = play(game, 'a1-c2-c4');
    game = play(game, 'a6-b5-b2');
    game = play(game, 'c1-c2-c4-d6');
    game = play(game, 'e6-e3');
    game = play(game, 'b1-b2-b4');
    /*game = play(game, 'b6-b5');
    /*game = play(game, 'e1-e2');
    /*game = play(game, 'f6-f5');
    /*game = play(game, 'c1-d3');
    /*game = play(game, 'd6-c4');*/

    return 0;
  }
}

Program.main();
