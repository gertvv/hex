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
		var max_q = min_q + rows.length - 1;

		this.min_q = function(r) { return min_q; };
		this.max_q = function(r) { return max_q; };
		this.min_r = function(q) { return rows[q - min_q].min_r; };
		this.max_r = function(q) { return rows[q - min_q].min_r + rows[q - min_q].cells.length - 1; };

		var min_r = this.min_r(min_q);
		var max_r = this.max_r(min_q);
		for (var q = min_q + 1; q <= max_q; ++q) {
			min_r = Math.min(min_r, this.min_r(q));
			max_r = Math.max(max_r, this.max_r(q));
		}
		this.bounds = { 'q': [min_q, max_q], 'r': [min_r, max_r] };
		this.cellAt = function(q, r) {
			var row = rows[q - min_q];
			return rows[q - min_q].cells[r - row.min_r];
		};
		this.cartesian = function(q, r) {
			return {'x': Math.sqrt(3) * (r + q / 2), 'y': 3/2 * q};
		};
	};
});
