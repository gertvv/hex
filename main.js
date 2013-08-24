define([
	'lib/raphael',
	'src/StretchedHexagonalHexGrid',
	'src/Draw',
	'src/GameBoard'
], function(Raphael, StretchedHexagonalHexGrid, Draw, GameBoard) {
	var paper = new Raphael(document.getElementById('canvas_container'), 1200, 500);
	var grid = new StretchedHexagonalHexGrid(4, 8);
	var draw = new Draw(paper, grid, 25);
	var board = new GameBoard(grid, draw);

	function Tower(player) {
		this.type = 'tower';
		this.player = player;
		this.act = function(grid) {
			return {};
		}
	}

	function Melee(player) {
		this.type = 'melee';
		this.player = player;
		this.act = function(grid) {
			return { 'move' : [-1 * player, player, 0] };
		}
	}

	function Ranged(player) {
		this.type = 'ranged';
		this.player = player;
		this.act = function(grid) {
			return { 'move' : [-1 * player, player, 0] };
		}
	}

	for (var player = -1; player <= 1; player += 2) {
		board.addEntity([8 * player, -8 * player, 0], new Tower(player));
		board.addEntity([7 * player, -7 * player, 0], new Ranged(player));
		board.addEntity([5 * player, -5 * player, 0], new Melee(player));
	}

	document.getElementById('next_turn').onclick = function() {
		board.update();
	};
});
