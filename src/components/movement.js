define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser');

	return {
		movable: true,
		moveTo: function(x, y, queueMovement) {
			var time = this.game.physics.arcade.distanceToXY(this, x, y) * 1000 / this.speed,
				delay = this.moveTween.isRunning ? 0: 200;

			if(queueMovement && this.moveTween.isRunning) {
				this.moveTween.onComplete.add(_.bind(this.moveTo, this, x, y));
				return;
			}

			this.moveTween.stop();
			
			this.moveTween = this.
				game.
				add.
				tween(this).
				to({
					x:x,
					y:y,
				}, time, Phaser.Easing.Quadratic.InOut, true, delay);
			
			this.game.add.tween(this).to({
				rotation: this.game.physics.arcade.angleToXY(this, x, y),
			}, 500).start();
		},
	};
});
