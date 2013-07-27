// Implements a grid of hexagonal tiles
// The grid itself is shaped as a stretched hexagon
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
//
function stretched_hex_grid(radius, stretch) {
	// z-range is given by the radius: |z| <= R
    // then, |x| <= R + S, |y| <= R + S
	var width = radius + stretch;
	min_r = function(q) { return -width + Math.max(-q, 0); }
	max_r = function(q) { return width + Math.min(-q, 0); }

	var rows = [];
	for (var q = -radius; q <= radius; ++q) {
		rows[q + radius] = { 'min_r': min_r(q), 'cells': [] };
		for (var r = min_r(q); r <= max_r(q); ++r) {
			rows[q + radius].cells[r - min_r(q)] = {}; //[r, -r - q, q];
		}
	}

	var grid = {
		'bounds': { 'q': [-radius, radius], 'r': [-width, width] },
		'min_q': function(r) { return -radius; },
		'max_q': function(r) { return radius; },
		'min_r': function(q) { return rows[q + radius].min_r; },
		'max_r': function(q) { return rows[q + radius].min_r + rows[q + radius].cells.length - 1; },
		'cellAt': function(q, r) {
			var row = rows[q + radius];
			return rows[q + radius].cells[r - row.min_r];
		},
		'cartesian': function(q, r) {
			return {'x': Math.sqrt(3) * (r + q / 2), 'y': 3/2 * q};
		}
	};

	return grid;
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

window.onload = function() {
	var paper = new Raphael(document.getElementById('canvas_container'), 500, 500);
	var grid = stretched_hex_grid(3, 2);
	draw_grid(paper, grid, 20);
}
