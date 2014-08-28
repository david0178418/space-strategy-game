define(function() {
	'use strict';
	return {
		sounds: {},

		isDead: function() {
			return this.health <= 0;
		},

		damage: function(points) {
			this.health -= points;
			if(this.health < 0) {
				this.health = 0;
			}

			if(this.sounds.damage) {
				this.sounds.damage.play();
			}

			return this.health;
		},
	};
});