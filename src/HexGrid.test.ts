import HexGrid from './HexGrid';
import Cell from './Cell';
import XYZ from './XYZ';

describe('HexGrid', function() {
  it('should exist', function() {
    expect(HexGrid).toBeDefined();
  });

  it('should allow empty grid', function() {
    var it = new HexGrid(0, []);
  });

  function cell(xyz: XYZ): Cell {
    return { xyz, object: undefined };
  }

  it('should define bounds', function() {
    var it = new HexGrid(0, []);
    expect(it.bounds).toEqual({'q': [0, 0], 'r': [0, 0]});

    var it = new HexGrid(-2, [
      {'min_r': 1, cells: [cell([0,0,1]), cell([1,0,0])]}
    ]);
    expect(it.bounds).toEqual({'q': [-2, -1], 'r': [1, 3]});
  });

  describe('cells()', function() {
    it('should StopIteration immediately when empty', function() {
      var it = new HexGrid(0, [])[Symbol.iterator]();
      expect(it.next()).toEqual({ value: undefined, done: true });
    });
    it('should return the first cell', function() {
      var it = new HexGrid(0, [{min_r: 0, cells: [cell([0,0,1]), cell([1,0,0])]}])[Symbol.iterator]();
      expect(it.next()).toEqual({ value: cell([0,0,1]), done: false });
    });
    it('should return the cells of the first row', function() {
      var it = new HexGrid(0, [{min_r: 0, cells: [cell([0,0,1]), cell([1,0,0])]}])[Symbol.iterator]();
      expect(it.next()).toEqual({ value: cell([0,0,1]), done: false });
      expect(it.next()).toEqual({ value: cell([1,0,0]), done: false });
      expect(it.next()).toEqual({ value: undefined, done: true });
    });
    it('should continue to the second row', function() {
      var it = new HexGrid(0, [
        {min_r: 0, cells: [cell([1,0,0])]},
        {min_r: 0, cells: [cell([0,1,0])]}
      ])[Symbol.iterator]();
      expect(it.next()).toEqual({ value: cell([1,0,0]), done: false });
      expect(it.next()).toEqual({ value: cell([0,1,0]), done: false });
      expect(it.next()).toEqual({ value: undefined, done: true });
    });
    it('should read jagged array', function() {
      var it = new HexGrid(0, [
        {min_r: 0, cells: [cell([1,0,0])]},
        {min_r: 0, cells: [cell([0,1,0]), cell([0,0,1])]}
      ])[Symbol.iterator]();
      expect(it.next()).toEqual({ value: cell([1,0,0]), done: false });
      expect(it.next()).toEqual({ value: cell([0,1,0]), done: false });
      expect(it.next()).toEqual({ value: cell([0,0,1]), done: false });
      expect(it.next()).toEqual({ value: undefined, done: true });
    });
  });
                
  describe('neighbours()', function() {
    function cell(i: number): Cell { return { xyz: [i, i, i], object: undefined }; }
    var grid = new HexGrid(0, [
      { min_r:  0, cells: [11, 12, 13, 14, 15].map(cell) },
      { min_r:  0, cells:   [21, 22, 23, 24, 25].map(cell) },
      { min_r: -1, cells: [31, 32, 33, 34, 35].map(cell) },
      { min_r: -1, cells:   [41, 42, 43, 44, 45].map(cell) },
      { min_r: -2, cells: [51, 52, 53, 54, 55].map(cell) }
    ]);
    it('size=0 should return the cell itself', function() {
      expect(grid.neighbours({qr: [0, 0]}, 0)).toEqual([11].map(cell));
      expect(grid.neighbours({qr: [4, -1]}, 0)).toEqual([52].map(cell));
    });
    it('size=1 should return the cells at distance <= 1', function() {
      expect(grid.neighbours({qr: [2, 1]}, 1).sort()).toEqual(
        [22, 23, 32, 33, 34, 42, 43].map(cell));
      expect(grid.neighbours({qr: [1, 0]}, 1).sort()).toEqual(
        [11, 12, 21, 22, 31, 32].map(cell));
      expect(grid.neighbours({qr: [0, 0]}, 1).sort()).toEqual(
        [11, 12, 21].map(cell));
    });
    it('size=2 should return the cells at distance <= 2', function() {
      expect(grid.neighbours({qr: [4, 2]}, 2).sort()).toEqual(
        [34, 35, 43, 44, 45, 53, 54, 55].map(cell));
    });
  });
});
