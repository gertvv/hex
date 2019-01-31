import HexGrid from './HexGrid';

// Hex grid itself shaped as a stretched hexagon
export default class StretchedHexagonalHexGrid extends HexGrid {
  constructor(radius: number, stretch: number, asymmetric: boolean) {
    var asym = asymmetric ? 1 : 0;
    // z-range is given by the radius: |z| <= R
    // then, |x| <= R + S, |y| <= R + S
    var width = radius + stretch;
    var min_r = function(q: number) { return -width + Math.max(-q, 0); };
    var max_r = function(q: number) { return width + Math.min(-q, 0) + asym; };

    var rows = [];
    for (var q = -radius; q <= radius; ++q) {
      rows[q + radius] = { 'min_r': min_r(q), 'cells': [] };
      for (var r = min_r(q); r <= max_r(q); ++r) {
        rows[q + radius].cells[r - min_r(q)] = {
          xyz: [r, -r - q, q]
        };
      }
    }
    super(-radius, rows);
  }
};
