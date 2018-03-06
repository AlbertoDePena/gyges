# Gyges

* The board game has 6x6 crossings on which pieces can move.
* A player wins when he can place a piece on his opponent's Goal.
* There are 4 piece of each type: Single, Double and Triple.
* A player can move a piece from the first non-empty row (shore).
* A piece moves as many crossings (neither more or less) as its value.
* When the last move of a piece reaches an occupied crossing, the player
has two choices: **Bounce** or **Replace**.
* South always goes first.

#### Bounce

* The piece bounces off the reached piece as many moves as its value.
* A piece can bounce on several pieces.

#### Replace 

* A piece moved (A) takes the place of the piece (B) on the
reached crossing. Then the player can place the piece (B) on any free
crossing of the board except behind the opponent's first line (shore).
* A piece can move, **bounce** one or more times and finish its move on an
occupied crossing and **replace** it.

#### Forbidden

* A piece, during its move, can only pass through a line one time.
* A piece can't pass through a Goal. It can only reach it.
* A piece can't pass through another.
* To win, a piece must finish its move exactly on the Goal.
* A replaced piece can't be placed beyond the opponents first line (shore).
* Diagonal crossing is forbidden.
