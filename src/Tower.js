
define([], function() {
    return function(player) {
            this.type = 'tower';
            this.player = player;
            this.attack = function(board) {
                    return null;
            };
            this.move = function(board) {
                    return null;
            };
    };
});