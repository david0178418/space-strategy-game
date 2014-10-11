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
		var waypoints = entity.components.waypoints;
		var speed = entity.components.movable.speed;

		if(!waypoints.inProgress) {
			waypoints.inProgress = waypoints.queued.shift();
			this.game.physics.arcade.moveToXY(entity, waypoints.inProgress.x, waypoints.inProgress.y, speed);
			this.game.add.tween(entity).to({
				rotation: Phaser.Point.angle(waypoints.inProgress, entity.position),
			}, 500, undefined, true);
		} else if(game.physics.arcade.distanceToXY(entity, waypoints.inProgress.x, waypoints.inProgress.y) < entity.width) {
			waypoints.inProgress.onComplete && waypoints.inProgress.onComplete();
			waypoints.inProgress = null;

			if(!waypoints.queued.length) {
				entity.removeComponent("waypoints");
				entity.body.velocity.setTo(0);
			}
		}
	},

	runOneOLD: function(entity) {
		//TODO figure out better/more efficient waypoint structure
		var inProgressWaypoint = entity.components.waypoints.inProgress;
		var queuedWaypoints = entity.components.waypoints.queued;
		var time;

		if(inProgressWaypoint && inProgressWaypoint.complete) {
			entity.components.waypoints.inProgress = null;
			inProgressWaypoint = null;
		}

		if(!inProgressWaypoint && !queuedWaypoints.length) {
			// TODO Ensure new structure makes this block dead code.
			entity.removeComponent('waypoints');
			return;
		} else if (inProgressWaypoint) {
			return;
		}

		inProgressWaypoint = queuedWaypoints.splice(0, 1)[0];
		entity.components.waypoints.inProgress = inProgressWaypoint;
		time = this.game.physics.arcade.distanceToXY(entity, inProgressWaypoint.x, inProgressWaypoint.y) * 1000 / entity.components.movable.speed;

		inProgressWaypoint.rotationTween = this.game.add.tween(entity).to({
			rotation: Phaser.Point.angle(inProgressWaypoint, entity.position),
		}, 500);

		inProgressWaypoint.moveTween = this.game.add.tween(entity.position).to(inProgressWaypoint, time);

		inProgressWaypoint.moveTween
			.onComplete.add(function() {
				this.moveTween.stop();
				this.rotationTween.stop();
				this.complete = true;
			}, inProgressWaypoint);

		inProgressWaypoint.moveTween.start();
		inProgressWaypoint.rotationTween.start();
	},
});