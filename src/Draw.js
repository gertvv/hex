define([], function() {
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

	return draw_grid;
});
