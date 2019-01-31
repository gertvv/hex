import XYZ from './XYZ';
import GameBoard from './GameBoard';
import RaphaelSet from 'raphael';

export default interface BoardEntity {
  readonly type: string;
  readonly player: number;
  id: number;
  img: RaphaelSet; // ew

  attack(board: GameBoard): XYZ;
  move(board: GameBoard): XYZ;
};
