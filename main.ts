import { Game, Player, Piece } from './app/gyges/models';
import { printBoard, makeMove, newGame, getSelectableCells } from './app/gyges/engine';

const print = (game: Game): void => {
  printBoard(game.board);
  console.log('');
  console.log(`${game.player}: ${getSelectableCells(game.board, game.player)}`);
  console.log('');
};

const play = (game: Game, moveNotation: string): Game => {
  makeMove(game, moveNotation);
  print(game);
  return game;
};

class Program {

  public static main(): number {
    const northSetup = [
      Piece.Double, Piece.Single, Piece.Double,
      Piece.Triple, Piece.Triple, Piece.Single
    ];
    const southSetup = [
      Piece.Triple, Piece.Single, Piece.Triple,
      Piece.Double, Piece.Single, Piece.Double
    ];
    let game = newGame(northSetup, southSetup, Player.South);

    print(game);
    game = play(game, 'd1-c2');
    game = play(game, 'c6-d5');
    game = play(game, 'f1-f3');
    game = play(game, 'e6-d4');
    game = play(game, 'b1-b2');
    game = play(game, 'a6-a4');
    game = play(game, 'a1-b3');
    game = play(game, 'b6-b5');
    game = play(game, 'e1-e2');
    game = play(game, 'f6-f5');

    return 0;
  }
}

Program.main();
