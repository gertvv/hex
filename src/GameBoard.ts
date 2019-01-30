import XYZ from './XYZ';
import Cell from './Cell';

export default class GameBoard {
  private entityId: any;
  public grid: any;
  private draw: any;
  private entities: any;

  constructor(grid: any, draw: any) {
    this.entityId = 0;
    this.grid = grid;
    this.draw = draw;
    this.entities = [];
    draw.drawGrid();
  }

  addEntity(xyz: XYZ, entity: any) {
    var cell = this.grid.cellAt({'xyz': xyz});
    cell.object = entity;
    entity.id = ++this.entityId;
    this.entities.push(entity);
    entity.img = this.draw.addEntity(cell);
  };

  moveEntity(from: XYZ, to: XYZ) {
    var fromCell = this.grid.cellAt({'xyz': from});
    var toCell = this.grid.cellAt({'xyz': to});
    if (toCell.object) {
      throw "Illegal move: cell occupado";
    }
    toCell.object = fromCell.object;
    fromCell.object = null;
    this.draw.moveEntity(toCell);
  };

  find(object: any): Cell {
    for (var cell of this.grid) {
      if (cell.object === object) {
        return cell as Cell;
      }
    }
    return null;
  };

  update() {
    var board = this;
    var pacifists: any[] = [];
    // Attack loop
    this.entities.forEach(function(entity: any) {
      var action = entity.attack();
      if (action) {
      } else {
        pacifists.push(entity);
      }
    });
    // Move loop
    pacifists.forEach(function(entity) {
      var action = entity.move(board);
      if (action) {
        var from = board.find(entity).xyz as XYZ;
        var to: XYZ = [0, 0, 0];
        for (var i = 0; i < 3; ++i) {
          to[i] = from[i] + action[i];
        }
        board.moveEntity(from, to);
      }
    });
  };
}
