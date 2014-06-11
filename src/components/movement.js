define(function(require) {
	"use strict";
	var Phaser = require('phaser');
	
	return {
		moveTo: function(x, y) {
			var time = this.game.physics.arcade.distanceToXY(this, x, y) * 1000 / this.speed,
				delay = this.moveTween.isRunning ? 0: 200;
			
			this.moveTween.stop();
			
			this.moveTween = this.
				game.
				add.
				tween(this).
				to({
					x:x,
					y:y
				}, time, Phaser.Easing.Quadratic.InOut, true, delay);
		},
	};
});