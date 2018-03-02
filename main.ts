import { getShoreCells, printBoard, newGame, getPossibleMoves } from './app/gyges/common';
import { Game, Player, Piece } from './app/gyges/models';
import { makeMove } from './app/gyges/engine';

const print = (game: Game): void => {
  printBoard(game.board);
  console.log('');
  const cells = getShoreCells(game.board, game.player);
  console.log(`${game.player}: ${cells}`);
  console.log('');
};

const play = (game: Game, move: string): Game => {
  makeMove(game, move);
  print(game);
  return game;
};

class Program {

  public static main(): number {
    let game = newGame('212331', '313212', Player.North);

    print(game);

    const moves = getPossibleMoves(game.board, game.player, 'd6');
    console.log(moves);
    /*game = play(game, 'd1-c2');
    /*game = play(game, 'd6-b5');
    /*game = play(game, 'b1-c1-c2-c4');
    /*game = play(game, 'a6-b5-d6');
    /*game = play(game, 'e1-e2-d5');
    /*game = play(game, 'c6-c4');
    /*game = play(game, 'b1-c1-f1');
    /*game = play(game, 'b6-b5');
    /*game = play(game, 'e1-e2');
    /*game = play(game, 'f6-f5');
    /*game = play(game, 'c1-d3');
    /*game = play(game, 'd6-c4');*/

    return 0;
  }
}

Program.main();
