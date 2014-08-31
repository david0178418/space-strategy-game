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
		//TODO figure out better/more efficient waypoint structure
		var activeWaypoint;
		var waypoint;
		var movementInProgress = false;
		var waypoints = entity.components.waypoints.points;

		for(var i = 0; i < waypoints.length; i++) {
			waypoint = waypoints[i];

			if(waypoint.inProgress) {
				movementInProgress = true;
			}

			if(!waypoint.marker) {
				waypoint.marker =  new Phaser.Sprite(this.game, waypoint.x, waypoint.y, 'waypointMarker');
				waypoint.marker.anchor.setTo(0.5, 0.5);
				this.worldEntities.add(waypoint.marker);
			}
		}

		if(!waypoints.length) {
			// TODO Ensure new structure makes this block dead code.
			entity.removeComponent('waypoints');
			return;
		}

		if(movementInProgress) {
			return;
		}

		activeWaypoint = waypoints[0];
		activeWaypoint.inProgress = true;
		
		var time = this.game.physics.arcade.distanceToXY(entity, activeWaypoint.x, activeWaypoint.y) * 1000 / entity.components.movable.speed;

		activeWaypoint.rotationTween = this.game.add.tween(entity).to({
			rotation: Phaser.Point.angle(activeWaypoint, entity.position),
		}, 500);
		activeWaypoint.moveTween = this.game.add.tween(entity.position).to(activeWaypoint, time);
		activeWaypoint.moveTween
			.onComplete.add(function() {
				this.marker.destroy();
				this.moveTween.stop();
				this.rotationTween.stop();
				waypoint.inProgress = false;
				waypoints.splice(0, 1);
			}, activeWaypoint);

		activeWaypoint.moveTween.start();
		activeWaypoint.rotationTween.start();
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