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
define([], function() {
	return function(min_q, rows) {
		var max_q = min_q + rows.length;

		this.min_q = function(r) { return min_q; };
		this.max_q = function(r) { return max_q; };
		this.min_r = function(q) { return rows[q - min_q].min_r; };
		this.max_r = function(q) { return rows[q - min_q].min_r + rows[q - min_q].cells.length; };

		var min_r = rows.length > 0 ? this.min_r(min_q) : 0;
		var max_r = rows.length > 0 ? this.max_r(min_q) : 0;
		for (var q = min_q + 1; q < max_q; ++q) {
			min_r = Math.min(min_r, this.min_r(q));
			max_r = Math.max(max_r, this.max_r(q));
		}

		this.bounds = { 'q': [min_q, max_q], 'r': [min_r, max_r] };
		function coords_qr(coords) {
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
		this.cellAt = function(coords) {
			var qr = coords_qr(coords);
			var row = rows[qr.q - min_q];
			return rows[qr.q - min_q].cells[qr.r - row.min_r];
		};
		this.cartesian = function(coords) {
			var qr = coords_qr(coords);
			return {'x': Math.sqrt(3) * (qr.r + qr.q / 2), 'y': 3/2 * qr.q};
		};
		this.cells = function() {
			function CellIterator(grid) {
				var countc = 0;
				var countr = 0;
				this.next = function() {
					if (rows.length === 0) {
						throw StopIteration;
					} else if (countc < rows[countr].cells.length) {
						return rows[countr].cells[countc++];
					} else if (countr < rows.length - 1) {
						countc = 0;
						return rows[++countr].cells[countc++];
					} else {
						throw StopIteration;
					}
				};
			}
			return new CellIterator(this);
		};
		this.__iterator__ = function() { return this.cells(); };
	};
});
