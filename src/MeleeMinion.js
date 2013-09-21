define(['src/Minion'], function(Minion) {
	return function(player) {
            this.super = Minion;
            this.super(player, 'melee');
	}
});