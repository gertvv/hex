define(['jasmine', 'src/HexGrid'], function(jasmine, HexGrid) {
	describe('HexGrid', function() {
		it('should exist', function() {
			expect(HexGrid).toBeDefined();
		});

		it('should allow empty grid', function() {
			var it = new HexGrid(0, []);
		});

		it('should define bounds', function() {
			var it = new HexGrid(0, []);
			expect(it.bounds).toEqual({'q': [0, 0], 'r': [0, 0]});

			var it = new HexGrid(-2, [
				{'min_r': 1, cells: ['A', 'Z']}
			]);
			expect(it.bounds).toEqual({'q': [-2, -1], 'r': [1, 3]});
		});

		describe('cells()', function() {
			it('should StopIteration immediately when empty', function() {
				var it = new HexGrid(0, []).cells();
				expect(it.next).toThrow(StopIteration);
			});
			it('should return the first cell', function() {
				var it = new HexGrid(0, [{min_r: 0, cells: ['A', 'Z']}]).cells();
				expect(it.next()).toBe('A');
			});
			it('should return the cells of the first row', function() {
				var it = new HexGrid(0, [{min_r: 0, cells: ['Z', 'A']}]).cells();
				expect(it.next()).toBe('Z');
				expect(it.next()).toBe('A');
				expect(it.next).toThrow(StopIteration);
			});
			it('should continue to the second row', function() {
				var it = new HexGrid(0, [
					{min_r: 0, cells: ['Z']},
					{min_r: 0, cells: ['Q']}
				]).cells();
				expect(it.next()).toBe('Z');
				expect(it.next()).toBe('Q');
				expect(it.next).toThrow(StopIteration);
			});
			it('should read jagged array', function() {
				var it = new HexGrid(0, [
					{min_r: 0, cells: ['Z']},
					{min_r: 0, cells: ['Q', 'R']}
				]).cells();
				expect(it.next()).toBe('Z');
				expect(it.next()).toBe('Q');
				expect(it.next()).toBe('R');
				expect(it.next).toThrow(StopIteration);
			});
		});
	});
});
