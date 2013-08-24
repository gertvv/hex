// Hex grid itself shaped as a stretched hexagon
define(['src/HexGrid'], function(HexGrid) {
	return function(radius, stretch) {
		// z-range is given by the radius: |z| <= R
		// then, |x| <= R + S, |y| <= R + S
		var width = radius + stretch;
		var min_r = function(q) { return -width + Math.max(-q, 0); }
		var max_r = function(q) { return width + Math.min(-q, 0); }

		var rows = [];
		for (var q = -radius; q <= radius; ++q) {
			rows[q + radius] = { 'min_r': min_r(q), 'cells': [] };
			for (var r = min_r(q); r <= max_r(q); ++r) {
				rows[q + radius].cells[r - min_r(q)] = {
					xyz: [r, -r - q, q]
				};
			}
		}

		this.super = HexGrid;
		this.super(-radius, rows);
	};
});
