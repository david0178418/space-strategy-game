define(function(require) {
	"use strict";
	var Phaser = require('phaser');
	
	return {
		moveTo: function(x, y) {
			var time = this.game.physics.arcade.distanceToXY(this, x, y) * 1000 / this.speed;
			this.moveTween.stop();
			console.log(x, y);
			this.moveTween = this.
				game.
				add.
				tween(this).
				to({
					x:x,
					y:y
				}, time, Phaser.Easing.Cubic.In, true, 200);
		},
	};
});