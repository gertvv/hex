import images from '../images/*.png';
import RaphaelPaper from 'raphael';
import HexGrid from './HexGrid';
import { Coords, Cartesian } from './HexGrid';
import Cell from './Cell';

export default class Draw {
  private paper: RaphaelPaper;
  private grid: HexGrid;
  private size: number;
  private min_cart: Cartesian;
  private offset_x: number;
  private offset_y: number;

  constructor(paper: RaphaelPaper, grid: HexGrid, size: number) {
    this.paper = paper;
    this.grid = grid;
    this.size = size;
    this.min_cart = grid.cartesian({'qr': [grid.bounds.q[0], grid.bounds.r[0]]});
    this.offset_x = -size * (this.min_cart.x - 1);
    this.offset_y = -size * (this.min_cart.y - 3/2);
  }

  private draw_hex(x: number, y: number) {
    var angle = Math.PI / 6;
    x += (this.size * Math.cos(angle));
    y += (this.size * Math.sin(angle));
    var str = 'M' + x + ',' + y;
    for (var i = 0; i < 6; ++i) {
      angle = -5 * Math.PI / 6 - Math.PI / 3 * i;
      str += 'l' + (this.size * Math.cos(angle)) + ',' + (this.size * Math.sin(angle));
    }
    str += 'z';
    var path = this.paper.path(str);
    path.attr({'fill': '#09A'});
    return path;
  }

  drawGrid() {
    function cell_onclick(coords: Coords) {
      return function() {
        console.log(this.grid.cellAt(coords));
      };
    }
    for (var cell of this.grid) {
      var cart = this.grid.cartesian(cell);
      var path = this.draw_hex(this.offset_x + cart.x * this.size, this.offset_y + cart.y * this.size);
      path.node.onclick = cell_onclick({'xyz' : cell.xyz});
    }
  };

  addEntity(cell: Cell) {
    var url = images[cell.object.type];
    var image = this.paper.image(url, 0, 0, 50, 50);
    image.transform('t-25,0');

    var rect = this.paper.rect(0, 0, 14, 15, 3);
    rect.transform('t-7,-7');

    var text = this.paper.text(0, 0, cell.object.id);

    if (cell.object.player === 1) {
      rect.attr({'fill': '#ff0000'});
      text.attr({'stroke': '#ffffff'});
    } else {
      rect.attr({'fill': '#0000ff'});
      text.attr({'stroke': '#ffffff'});
    }

    var set = this.paper.set();
    set.push(image);
    set.push(text);
    set.push(rect);

    var cart = this.grid.cartesian(cell);
    var x = this.offset_x + cart.x * this.size;
    var y = this.offset_y + cart.y * this.size;
    set.animate({'x': x, 'y': y}, 0);
    return set;
  };

  moveEntity(to: Cell) {
    var img = to.object.img;
    var cart = this.grid.cartesian(to);
    var x = this.offset_x + cart.x * this.size;
    var y = this.offset_y + cart.y * this.size;
    
    img.animate({'x': x, 'y': y}, 1000);
  };
}
