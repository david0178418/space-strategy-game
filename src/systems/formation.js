require('ecs/ecs').registerSystem('formation', {
	components: [
		'group-movement',
	],

	init: function() {
		var instanceManager = require('instance-manager');
		this.game = instanceManager.get('game');
		this.worldEntities = instanceManager.get('worldEntities');
		this.controls = instanceManager.get('controls');
	},

	run: function(entities) {
		var avgX;
		var avgY;
		var destination = entities[0].components['group-movement'].centralPoint;
		var entity;
		var i;
		var maxX = this.game.world.height * 10;
		var maxY = this.game.world.width * 10;
		var minX = -1;
		var minY = -1;
		var movableSelectedCount = 0;
		var rowCount;
		var slotWidth = 80;
		var waypointsComponent;
		var xDiff;
		var xTotal = 0;
		var yDiff;
		var yTotal = 0;

		for(i = 0; i < entities.length; i++) {
			entity = entities[i];
			movableSelectedCount++;
			xTotal += entity.x;
			yTotal += entity.y;
			
			if(entity.x > maxX) {
				maxX = entity.x;
			} else if(entity.x < minX) {
				minX = entity.x;
			}
			
			if(entity.y > maxY) {
				maxY = entity.y;
			} else if(entity.y < minY) {
				minY = entity.y;
			}
		}
		
		rowCount = Math.sqrt(movableSelectedCount) | 0;

		avgX = xTotal / movableSelectedCount;
		avgY = yTotal / movableSelectedCount;
		
		for(i = 0; i < entities.length; i++) {
			entity = entities[i];
			
			xDiff = slotWidth * (i % rowCount);
			yDiff = slotWidth * ((i / rowCount)| 0);

			waypointsComponent = entity.components.waypoints;

			if(this.controls.shiftModifier.isDown && waypointsComponent && waypointsComponent.inProgress) {
				entity.components.waypoints.queued.push({
					x: destination.x + xDiff,
					y: destination.y + yDiff,
				});
			} else {
				if(waypointsComponent && waypointsComponent.inProgress) {
					this.stopMovement(waypointsComponent.inProgress);
				}

				entity.components.waypoints = {
					queued: [
						{
							x: destination.x + xDiff,
							y: destination.y + yDiff,
						}
					]
				};

				entity.removeComponent('group-movement');
			}
		}
	},
	stopMovement: function(waypoint) {
		waypoint.marker.destroy();
		waypoint.moveTween.stop();
		waypoint.rotationTween.stop();
	}
});