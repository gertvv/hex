export default class Minion {
  private player: number;
  private type: string;

  constructor(player: number, type: string) {
    this.player = player;
    this.type = type;
  }
  
  attack(board: any): any {
    return null;
  };

  move(board: any) {
    var cell = board.find(this);
    var move = [-1 * this.player, this.player, 0];
    var xyz = [cell.xyz[0] + move[0],
      cell.xyz[1] + move[1],
      cell.xyz[2] + move[2]];

    if (board.grid.cellAt({'xyz':xyz}).object) {
      return null;
    }
    return move;
  };
};
