import GameBoard from './GameBoard';
import BoardEntity from './BoardEntity';
import XYZ from './XYZ';
import RaphaelSet from 'raphael';

export default class Minion implements BoardEntity {
  readonly player: number;
  readonly type: string;
  public id: number;
  public img: RaphaelSet;

  constructor(player: number, type: string) {
    this.player = player;
    this.type = type;
  }
  
  attack(board: GameBoard): XYZ {
    return null;
  };

  move(board: GameBoard): XYZ {
    var cell = board.find(this);
    var move: XYZ = [-1 * this.player, this.player, 0];
    var xyz: XYZ = [cell.xyz[0] + move[0],
      cell.xyz[1] + move[1],
      cell.xyz[2] + move[2]];

    if (board.grid.cellAt({'xyz':xyz}).object) {
      return null;
    }
    return move;
  };
};
