define([], function() {
	return function(player, type) {
		this.player = player;
		this.type = type;
		this.attack = function(board) {
			return null;
		};
		this.move = function(board) {
			var cell = board.find(this);
			var move = [-1 * player, player, 0];
			var xyz = [cell.xyz[0] + move[0],
				cell.xyz[1] + move[1],
				cell.xyz[2] + move[2]];

			if (board.grid.cellAt({'xyz':xyz}).object) {
				return null;
			}
			return move;
		};
	};
});