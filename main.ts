import { Move } from './app/gyges/move';
import { Player, Piece } from './app/gyges/enums';
import { Game } from './app/gyges/game';

const print = (game: Game) => {
    game.board.print();

    console.log('');
    console.log(`${game.player}: ${game.board.getSelectableCells(game.player)}`);
    console.log('');
};

const play = (game: Game, moveNotation: string) => {
    game.makeMove(moveNotation);
    print(game);
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
        const game = new Game(northSetup, southSetup, Player.South);

        print(game);
        play(game, 'd1-c2');
        play(game, 'c6-d5');
        play(game, 'f1-f3');
        play(game, 'e6-d4');
        play(game, 'b1-b2');
        play(game, 'a6-a4');
        play(game, 'a1-b3');
        play(game, 'b6-b5');
        play(game, 'e1-e2');
        play(game, 'f6-f5');

        return 0;
    }
}

Program.main();