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
			var url = 'images/' + {
				'tower': 'tower',
				'melee': 'sword',
				'ranged': 'bow'}[cell.object.type] + '.png';
			var image = paper.image(url, 0, 0, 50, 50);
			image.transform('t-25,0');

			var rect = paper.rect(0, 0, 14, 15, 3);
			rect.transform('t-7,-7');

			var text = paper.text(0, 0, cell.object.id);

			if (cell.object.player == 1) {
				rect.attr({'fill': '#ff0000'});
				text.attr({'stroke': '#ffffff'});
			} else {
				rect.attr({'fill': '#0000ff'});
				text.attr({'stroke': '#ffffff'});
			}

			var set = paper.set();
			set.push(image);
			set.push(text);
			set.push(rect);

			var cart = grid.cartesian(cell);
			var x = offset_x + cart.x * size;
			var y = offset_y + cart.y * size;
			set.animate({'x': x, 'y': y}, 0);
			return set;
		}

		this.moveEntity = function(to) {
			var img = to.object.img;
			var cart = grid.cartesian(to);
			var x = offset_x + cart.x * size;
			var y = offset_y + cart.y * size;
			
			img.animate({'x': x, 'y': y}, 1000);
		}
	}

	return Draw;
});
