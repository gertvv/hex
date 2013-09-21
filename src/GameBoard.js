define([], function() {
	function GameBoard(grid, draw) {
		this.entityId = 0;
		this.grid = grid;
		this.draw = draw;
		this.entities = [];
		draw.drawGrid();

		this.addEntity = function(xyz, entity) {
			var cell = this.grid.cellAt({'xyz': xyz});
			cell.object = entity;
			entity.id = ++this.entityId;
			this.entities.push(entity);
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

		this.find = function(object) {
			for (var cell in grid) {
				if (cell.object == object) {
					return cell;
				}
			}
			return null;
		}

		this.update = function() {
			var board = this;
			var pacifists = [];
			// Attack loop
			this.entities.forEach(function(entity) {
				var action = entity.attack();
				if (action) {
				} else {
					pacifists.push(entity);
				}
			});
			// Move loop
			pacifists.forEach(function(entity) {
				var action = entity.move(board);
				if (action) {
					var from = board.find(entity).xyz;
					var to = [];
					for (var i = 0; i < 3; ++i) {
						to[i] = from[i] + action[i];
					}
					board.moveEntity(from, to);
				}
			});
		}
	}

	return GameBoard;
});
