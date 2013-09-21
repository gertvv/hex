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
                
                describe('neighbours()', function() {
                    var grid = new HexGrid(0, [
                        { min_r:  0, cells: [11, 12, 13, 14, 15] },
                        { min_r:  0, cells:   [21, 22, 23, 24, 25] },
                        { min_r: -1, cells: [31, 32, 33, 34, 35] },
                        { min_r: -1, cells:   [41, 42, 43, 44, 45] },
                        { min_r: -2, cells: [51, 52, 53, 54, 55] }
                    ]);
                    it('size=0 should return the cell itself', function() {
                        expect(grid.neighbours({qr: [0, 0]}, 0)).toEqual([11]);
                        expect(grid.neighbours({qr: [4, -1]}, 0)).toEqual([52]);
                    });
                    it('size=1 should return the cells at distance <= 1', function() {
                        expect(Array.sort(grid.neighbours({qr: [2, 1]}, 1))).toEqual(
                            [22, 23, 32, 33, 34, 42, 43]);
                        expect(Array.sort(grid.neighbours({qr: [1, 0]}, 1))).toEqual(
                            [11, 12, 21, 22, 31, 32]);
                        expect(Array.sort(grid.neighbours({qr: [0, 0]}, 1))).toEqual(
                            [11, 12, 21]);
                    });
                    it('size=2 should return the cells at distance <= 2', function() {
                        expect(Array.sort(grid.neighbours({qr: [4, 2]}, 2))).toEqual(
                            [34, 35, 43, 44, 45, 53, 54, 55]);
                    });
                });
	});
});
