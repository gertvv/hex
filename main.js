define([
	'lib/raphael',
	'src/StretchedHexagonalHexGrid',
	'src/Draw'
], function(Raphael, StretchedHexagonalHexGrid, draw_grid) {
	window.onload = function() {
		var paper = new Raphael(document.getElementById('canvas_container'), 500, 500);
		var grid = new StretchedHexagonalHexGrid(3, 2);
		draw_grid(paper, grid, 20);
	}
});
