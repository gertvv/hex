define([
	'src/StretchedHexagonalHexGrid',
	'src/Draw',
	'src/GameBoard'
], function(StretchedHexagonalHexGrid, Draw, GameBoard) {
	var paper = new Raphael(document.getElementById('canvas_container'), 1200, 500);
	var grid = new StretchedHexagonalHexGrid(4, 8, true);
	var draw = new Draw(paper, grid, 25);
	var board = new GameBoard(grid, draw);

	function Tower(player) {
		this.type = 'tower';
		this.player = player;
		this.act = function(board) {
			return {};
		}
	}

	function Melee(player) {
		this.type = 'melee';
		this.player = player;
		this.act = function(board) {
			var cell = board.find(this);
			var move = [-1 * player, player, 0];
			var xyz = [cell.xyz[0] + move[0],
				cell.xyz[1] + move[1],
				cell.xyz[2] + move[2]];

			if (board.grid.cellAt({'xyz':xyz}).object) {
				return {};
			}
			return { 'move' : move };
		}
	}

	function Ranged(player) {
		this.type = 'ranged';
		this.player = player;
		this.act = function(board) {
			var cell = board.find(this);
			var move = [-1 * player, player, 0];
			var xyz = [cell.xyz[0] + move[0],
				cell.xyz[1] + move[1],
				cell.xyz[2] + move[2]];

			if (board.grid.cellAt({'xyz':xyz}).object) {
				return {};
			}
			return { 'move' : move };
		}
	}

	var tower  = [[8, -8, 0]];
	var ranged = [[7, -7, 0], [7, -8, 1], [8, -7, -1]];
	var melee  = [[5, -5, 0], [5, -6, 1], [6, -5, -1]];

	function mult(coords, player) {
		var rval = [];
		for (var i = 0; i < coords.length; ++i) {
			rval[i] = coords[i] * player;
		}
		return rval;
	}

	function asym(coords, player) {
		if (player == -1) return coords;
		else return [coords[0] + 1, coords[1] - 1, coords[2]];
	}

	tower.forEach(function(coords) {
		for (var player = -1; player <= 1; player += 2) {
			board.addEntity(asym(mult(coords, player), player), new Tower(player));
		}
	});
	melee.forEach(function(coords) {
		for (var player = -1; player <= 1; player += 2) {
			board.addEntity(asym(mult(coords, player), player), new Melee(player));
		}
	});
	ranged.forEach(function(coords) {
		for (var player = -1; player <= 1; player += 2) {
			board.addEntity(asym(mult(coords, player), player), new Ranged(player));
		}
	});

	document.getElementById('next_turn').onclick = function() {
		board.update();
	};
});
