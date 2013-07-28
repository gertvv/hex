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
function HexGrid(min_q, rows) {
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
}

// Hex grid itself shaped as a stretched hexagon
function StretchedHexagonalHexGrid(radius, stretch) {
	// z-range is given by the radius: |z| <= R
    // then, |x| <= R + S, |y| <= R + S
	var width = radius + stretch;
	var min_r = function(q) { return -width + Math.max(-q, 0); }
	var max_r = function(q) { return width + Math.min(-q, 0); }

	var rows = [];
	for (var q = -radius; q <= radius; ++q) {
		rows[q + radius] = { 'min_r': min_r(q), 'cells': [] };
		for (var r = min_r(q); r <= max_r(q); ++r) {
			rows[q + radius].cells[r - min_r(q)] = {}; //[r, -r - q, q];
		}
	}

	this.super = HexGrid;
	this.super(-radius, rows);
}

function draw_hex(paper, x, y, size) {
	var angle = Math.PI / 6;
	x += (size * Math.cos(angle));
	y += (size * Math.sin(angle));
	var str = 'M' + x + ',' + y;
	for (var i = 0; i < 6; ++i) {
		angle = -5 * Math.PI / 6 - Math.PI / 3 * i;
		str += 'l' + (size * Math.cos(angle)) + ',' + (size * Math.sin(angle));
	}
	str += 'z';
	var path = paper.path(str);
	path.attr({'fill': '#09A'});
	path.node.onclick = function() {
		path.animate({'fill': '#A90'}, 1000);
	}
	return path;
}

function draw_grid(paper, grid, size) {
	var min_cart = grid.cartesian(grid.bounds.q[0], grid.bounds.r[0]);
	var offset_x = -size * (min_cart.x - 1);
	var offset_y = -size * (min_cart.y - 3/2);
	for (var q = grid.bounds.q[0]; q <= grid.bounds.q[1]; ++q) {
		for (var r = grid.min_r(q); r <= grid.max_r(q); ++r) {
			var cart = grid.cartesian(q, r);
			draw_hex(paper,
				offset_x + cart.x * size, offset_y + cart.y * size, size)
		}
	}
}
