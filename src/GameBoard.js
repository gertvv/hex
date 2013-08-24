define([], function() {
	function GameBoard(grid, draw) {
		this.grid = grid;
		this.draw = draw;
		draw.drawGrid();

		this.addEntity = function(xyz, entity) {
			var cell = this.grid.cellAt({'xyz': xyz});
			cell.object = entity;
			entity.img = draw.addEntity(cell);
		}

		this.moveEntity = function(from, to) {
			var fromCell = grid.cellAt({'xyz': from});
			var toCell = grid.cellAt({'xyz': to});
			if (toCell.object) {
				throw "Illegal move: cell occupado";
			}
			toCell.object = fromCell.object;
			fromCell.object = null;
			draw.moveEntity(toCell);
		}

		this.update = function() {
			for (var cell in grid) {
				if (cell.object) {
					var action = cell.object.act(grid);
					if (action.move) {
						var from = cell.xyz;
						var to = [];
						for (var i = 0; i < 3; ++i) {
							to[i] = from[i] + action.move[i];
						}
						this.moveEntity(from, to);
					}
				}
			}
		}
	}

	return GameBoard;
});
