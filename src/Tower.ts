import XYZ from './XYZ';
import GameBoard from './GameBoard';

export default class Tower {
  public type: string;
  public player: number;

  constructor(player: number) {
    this.type = 'tower';
    this.player = player;
  }

  attack(board: GameBoard): any {
    return null;
  }

  move(board: GameBoard): XYZ {
    return null;
  }
}
