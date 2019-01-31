// Implements a grid of hexagonal tiles
//
// Coordinates represented in the cube/axial system, see
// http://www.redblobgames.com/grids/hexagons/
//
// x-coordinates are 
//  * constant on the north-west/south-east axis
//  * increasing to the east
//  * increasing to the north-east
// y-coordinates are
//  * constant on the north-east/south-west axis
//  * increasing to the west
//  * increasing to the north-west
// z-coordinates are
//  * constant on the east/west axis
//  * increasing to the south-east
//  * increasing to the south-west
// x + y + z = 0.
//
// Axial coordinates are q = z and r = x, with y implicit.
//
// d(a, b) = max(|x_b - x_a|, |y_b - y_a|, |z_b - z_a|)

import XYZ from './XYZ';
import Cell from './Cell';

export interface Coords {
  qr?: [number, number];
  xyz?: XYZ
};

interface QRObj {
  q: number;
  r: number;
};

interface QRBounds {
  q: [number, number];
  r: [number, number];
};

export interface Cartesian {
  x: number;
  y: number;
}

interface Row {
  min_r: number;
  cells: Array<Cell>;
};

class CellIterator implements Iterator<Cell> {
  private countc = 0;
  private countr = 0;
  private rows: Array<Row>;

  constructor(rows: Array<Row>) {
    this.rows = rows;
  }

  next(): IteratorResult<Cell> {
    if (this.rows.length === 0) {
      return { done: true, value: undefined };
    } else if (this.countc < this.rows[this.countr].cells.length) {
      return { done: false, value: this.rows[this.countr].cells[this.countc++] };
    } else if (this.countr < this.rows.length - 1) {
      this.countc = 0;
      return { done: false, value: this.rows[++this.countr].cells[this.countc++] };
    } else {
      return { done: true, value: undefined };
    }
  };
}

export default class HexGrid {
  private _min_q: number;
  private _max_q: number;
  private rows: Array<Row>;
  public bounds: QRBounds;

  constructor(min_q: number, rows: Array<Row>) {
    this.rows = rows;
    this._min_q = min_q;
    const max_q = min_q + rows.length;
    this._max_q = max_q;
    let min_r = rows.length > 0 ? this.min_r(min_q) : 0;
    let max_r = rows.length > 0 ? this.max_r(min_q) : 0;
    for (var q = min_q + 1; q < max_q; ++q) {
      min_r = Math.min(min_r, this.min_r(q));
      max_r = Math.max(max_r, this.max_r(q));
    }

    this.bounds = { 'q': [min_q, max_q], 'r': [min_r, max_r] };
  }

  min_q(r: number): number { return this._min_q; };
  max_q(r: number): number { return this._max_q; };
  min_r(q: number): number { return this.rows[q - this._min_q].min_r; };
  max_r(q: number): number { return this.rows[q - this._min_q].min_r + this.rows[q - this._min_q].cells.length; };

  coords_qr(coords: Coords): QRObj {
    var q, r;
    if (coords.qr) {
      q = coords.qr[0];
      r = coords.qr[1];
    } else if (coords.xyz) {
      q = coords.xyz[2];
      r = coords.xyz[0];
    } else {
      throw 'Illegal coords ' + coords;
    }
    return {'q': q, 'r': r};
  }

  cellAt(coords: Coords): Cell {
    var qr = this.coords_qr(coords);
    var row = this.rows[qr.q - this._min_q];
    return row ? row.cells[qr.r - row.min_r] : undefined;
  }

  neighbours(coords: Coords, range: number): Array<Cell> {
    var qr = this.coords_qr(coords);
    var cells = [];
    for(var dq = -range; dq <= range; ++dq) {
      // dq + dr + ds = 0
      // ds = -dq - dr
      // -range <= ds <= range
      // -range <= -dq - dr <= range
      // -range + dq <= -dr <= range + dq
      //  range - dq >= dr >= -range - dq
      for(var dr = Math.max(-range, -range - dq);
              dr <= Math.min(range, range - dq); ++dr) {
        if (this.cellAt({qr: [qr.q + dq, qr.r + dr]})) {
          cells.push(this.cellAt({qr: [qr.q + dq, qr.r + dr]}));
        }
      }
    }
    return cells;
  }

  cartesian(coords: Coords): Cartesian {
    var qr = this.coords_qr(coords);
    return {'x': Math.sqrt(3) * (qr.r + qr.q / 2), 'y': 3/2 * qr.q};
  }

  [Symbol.iterator]() { return new CellIterator(this.rows); };
};
