import XYZ from './XYZ';
import HexGrid from './HexGrid';
import BoardEntity from './BoardEntity';
import Draw from './Draw';
import Cell from './Cell';

export default class GameBoard {
  readonly grid: HexGrid;
  private draw: Draw;
  private entityId: number;
  private entities: Array<BoardEntity>;

  constructor(grid: HexGrid, draw: Draw) {
    this.entityId = 0;
    this.grid = grid;
    this.draw = draw;
    this.entities = [];
    draw.drawGrid();
  }

  addEntity(xyz: XYZ, entity: BoardEntity) {
    const cell = this.grid.cellAt({'xyz': xyz});
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

  find(object: BoardEntity): Cell {
    for (var cell of this.grid) {
      if (cell.object === object) {
        return cell as Cell;
      }
    }
    return null;
  };

  update() {
    var board = this;
    var pacifists: Array<BoardEntity> = [];
    // Attack loop
    this.entities.forEach(function(entity: BoardEntity) {
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
