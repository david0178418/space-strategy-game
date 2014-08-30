var _ = require('lodash');
var Phaser = require('phaser');
var intanceManager = require('instance-manager');

require('ecs/ecs').registerSystem();

module.exports = {
	paths: null,
	moving: false,
	movable: true,
	
	moveTo: function(x, y, queueMovement) {
		var lastPath,
			wayPointMarker = new Phaser.Sprite(this.game, x, y, 'waypointMarker'),
			startingPoint = this.position,
			endPoint = {
				x: x,
				y: y,
			},
			time = this.game.physics.arcade.distanceToXY(this, x, y) * 1000 / this.speed,
			rotationTween = this.game.add.tween(this),
			moveTween = this.game.add.tween(this.position).
				to({
					x:x,
					y:y,
				}, time);
		
		wayPointMarker.anchor.setTo(0.5, 0.5);
		
		intanceManager.get('worldEntities').add(wayPointMarker);
		
		this.paths = this.paths || [];
		
		if(!queueMovement) {
			_.each(this.paths, function(path) {
				this._killPath(path);
			}, this);
			
			this.paths = [];
		} else if(this.paths.length) {
			lastPath = _.last(this.paths);
			startingPoint = lastPath.end;
		}
		
		this.paths.push({
			start: startingPoint,
			end: endPoint,
			graphic: wayPointMarker,
			move: moveTween,
			rotation: rotationTween,
		});
		
		rotationTween.to({
			rotation: Phaser.Point.angle(endPoint, startingPoint),
		}, 500);
		
		
		moveTween
			.onComplete.add(function() {
				this.paths = _.filter(this.paths, function(path) {
					if(path.graphic === wayPointMarker) {
						this._killPath(path);
						return false;
					} else {
						return true;
					}
					
				}, this);
			}, this);
		
		if(queueMovement && lastPath) {
			lastPath.move.onComplete.add(function() {
				moveTween.start();
				rotationTween.start();	
			});
		} else {
			moveTween.start();
			rotationTween.start();
		}
	},
	
	_killPath: function(path) {
		path.graphic.destroy();
		path.move.stop();
		path.rotation.stop();
	}
};