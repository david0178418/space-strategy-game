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
		var inProgressWaypoint = entity.components.waypoints.inProgress;
		var queuedWaypoints = entity.components.waypoints.queued;
		var waypoint;
		var time;

		if(inProgressWaypoint && inProgressWaypoint.complete) {
			entity.components.waypoints.inProgress = null;
			inProgressWaypoint = null;
		}

		for(var i = 0; i < queuedWaypoints.length; i++) {
			waypoint = queuedWaypoints[i];

			if(!waypoint.marker) {
				waypoint.marker =  new Phaser.Sprite(this.game, waypoint.x, waypoint.y, 'waypointMarker');
				waypoint.marker.anchor.setTo(0.5, 0.5);
				this.worldEntities.add(waypoint.marker);
			}
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
				this.marker.destroy();
				this.moveTween.stop();
				this.rotationTween.stop();
				this.complete = true;
			}, inProgressWaypoint);

		inProgressWaypoint.moveTween.start();
		inProgressWaypoint.rotationTween.start();
	},
});