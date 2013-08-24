define([], function() {
	function Draw(paper, grid, size) {
		var min_cart = grid.cartesian({'qr': [grid.bounds.q[0], grid.bounds.r[0]]});
		var offset_x = -size * (min_cart.x - 1);
		var offset_y = -size * (min_cart.y - 3/2);

		function draw_hex(x, y) {
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
			return path;
		}

		this.drawGrid = function() {
			function cell_onclick(coords) {
				return function() {
					console.log(grid.cellAt(coords));
				}
			}
			for (var cell in grid) {
				var cart = grid.cartesian(cell);
				var path = draw_hex(offset_x + cart.x * size, offset_y + cart.y * size);
				path.node.onclick = cell_onclick({'xyz' : cell.xyz});
			}
		}

		this.addEntity = function(cell) {
			//path.node.onclick = function() {
			//	path.animate({'fill': '#A90'}, 1000);
			//}
			var cart = grid.cartesian(cell);
			var x = offset_x + cart.x * size;
			var y = offset_y + cart.y * size;
			var url = 'images/' + {
				'tower': 'tower',
				'melee': 'sword',
				'ranged': 'bow'}[cell.object.type] + '.png';
			return paper.image(url, x - 25, y, 50, 50);
		}

		this.moveEntity = function(to) {
			var img = to.object.img;
			var cart = grid.cartesian(to);
			var x = offset_x + cart.x * size;
			var y = offset_y + cart.y * size;
			
			img.animate({'x': x - 25, 'y': y}, 1000);
		}
	}

	return Draw;
});
