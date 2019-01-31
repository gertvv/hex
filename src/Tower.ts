import XYZ from './XYZ';
import GameBoard from './GameBoard';
import BoardEntity from './BoardEntity';
import RaphaelSet from 'raphael';

export default class Tower implements BoardEntity {
  readonly type: string;
  readonly player: number;
  public id: number;
  public img: RaphaelSet;

  constructor(player: number) {
    this.type = 'tower';
    this.player = player;
  }

  attack(board: GameBoard): XYZ {
    return null;
  }

  move(board: GameBoard): XYZ {
    return null;
  }
}
