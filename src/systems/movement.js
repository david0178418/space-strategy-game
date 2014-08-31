var _ = require('lodash');
var Phaser = require('phaser');

require('ecs/ecs').registerSystem('movement', {
	components: [
		'movable',
		'waypoints',
	],

	init: function() {
		var instanceManager = require('instance-manager');
		this.game = instanceManager.get('game');
		this.worldEntities = instanceManager.get('worldEntities');
	},

	runOne: function(entity) {
		//TODO figure out better waypoint structure
		var waypoints = entity.components.waypoints.points;
		var waypoint = waypoints[0];

		if(!waypoint || waypoint.inProgress) {
			return;
		} else if(waypoint.complete) {
			waypoints.splice(0, 1);

			if(!waypoints.length) {
				entity.removeComponent('waypoints');
				return;
			}

			waypoint = waypoints[0];
		}

		waypoint.inProgress = true;

		var wayPointMarker = new Phaser.Sprite(this.game, waypoint.x, waypoint.y, 'waypointMarker');
		var time = this.game.physics.arcade.distanceToXY(entity, waypoint.x, waypoint.y) * 1000 / entity.components.movable.speed;
		var rotationTween = this.game.add.tween(entity).to({
			rotation: Phaser.Point.angle(waypoint, entity.position),
		}, 500);
		var moveTween = this.game.add.tween(entity.position).to(waypoint, time);
		wayPointMarker.anchor.setTo(0.5, 0.5);
		this.worldEntities.add(wayPointMarker);
		moveTween
			.onComplete.add(function() {
				wayPointMarker.destroy();
				moveTween.stop();
				rotationTween.stop();
				waypoint.inProgress = false;
				waypoint.complete = true;
			});
		moveTween.start();
		rotationTween.start();
	},

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
});