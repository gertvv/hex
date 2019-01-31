import StetchedHexagonalHexGrid from './StretchedHexagonalHexGrid';
import Draw from './Draw';
import GameBoard from './GameBoard';
import Tower from './Tower';
import RangedMinion from './RangedMinion';
import MeleeMinion from './MeleeMinion';
import Raphael from 'raphael';
import XYZ from './XYZ';

var paper = Raphael(document.getElementById('canvas_container'), 1200, 500);
var grid = new StetchedHexagonalHexGrid(4, 8, true);
var draw = new Draw(paper, grid, 25);
var board = new GameBoard(grid, draw);


var tower: Array<XYZ>  = [[8, -8, 0]];
var ranged: Array<XYZ> = [[7, -7, 0], [7, -8, 1], [8, -7, -1]];
var melee: Array<XYZ>  = [[5, -5, 0], [5, -6, 1], [6, -5, -1]];

function mult(coords: XYZ, player: number): XYZ {
  var rval: XYZ = [0, 0, 0];
  for (var i = 0; i < coords.length; ++i) {
    rval[i] = coords[i] * player;
  }
  return rval;
}

function asym(coords: XYZ, player: number): XYZ {
  if (player === -1) return coords;
  else return [coords[0] + 1, coords[1] - 1, coords[2]];
}

tower.forEach(function(coords) {
  for (var player = -1; player <= 1; player += 2) {
    board.addEntity(asym(mult(coords, player), player), new Tower(player));
  }
});
melee.forEach(function(coords) {
  for (var player = -1; player <= 1; player += 2) {
    board.addEntity(asym(mult(coords, player), player), new MeleeMinion(player));
  }
});
ranged.forEach(function(coords) {
  for (var player = -1; player <= 1; player += 2) {
    board.addEntity(asym(mult(coords, player), player), new RangedMinion(player));
  }
});

document.getElementById('next_turn').onclick = function() {
  board.update();
};
