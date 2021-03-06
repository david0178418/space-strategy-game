var _ = require('lodash');

require('ecs/ecs').registerSystem('formation', {
	components: [
		'group-movement',
	],

	init: function() {
		var instanceManager = require('instance-manager');
		this.game = instanceManager.get('game');
		this.worldEntities = instanceManager.get('worldEntities');
		this.moveOrderSound = this.game.add.audio('move-order');
	},

	run: function(entities) {
		var avgX;
		var avgY;
		var colCount;
		var formationCenterOffsetX;
		var formationCenterOffsetY;
		var formationPositionX;
		var formationPositionY;
		var groupMovementComponent = entities[0].components['group-movement'];
		var maxX = this.game.world.height * 10;
		var maxY = this.game.world.width * 10;
		var minX = -1;
		var minY = -1;
		var movableSelectedCount = 0;
		var rowCount;
		var slotWidth = 80;
		var waypointsComponent;
		var xTotal = 0;
		var yTotal = 0;

		_.each(entities, function(entity) {
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
		}, this);
		
		rowCount = Math.sqrt(movableSelectedCount) | 0;
		colCount = ((entities.length / rowCount) + 0.5) | 0;
		formationCenterOffsetX = (slotWidth * (rowCount - 1)) / 2;
		formationCenterOffsetY = (slotWidth * (colCount - 1)) / 2;

		avgX = xTotal / movableSelectedCount;
		avgY = yTotal / movableSelectedCount;
		
		_.each(entities, function(entity, i) {
			formationPositionX = groupMovementComponent.centralPoint.x + slotWidth * (i % rowCount) - formationCenterOffsetX;
			formationPositionY = groupMovementComponent.centralPoint.y + slotWidth * ((i / rowCount) | 0) - formationCenterOffsetY;

			waypointsComponent = entity.components.waypoints;

			if(groupMovementComponent.override && waypointsComponent && waypointsComponent.inProgress) {
				entity.components.waypoints.queued.push({
					x: formationPositionX,
					y: formationPositionY,
				});
			} else {
				entity.components.waypoints = {
					queued: [
						{
							x: formationPositionX,
							y: formationPositionY,
							hyperspace: groupMovementComponent.hyperspace,
						}
					]
				};
			}

			entity.removeComponent('group-movement');
		}, this);
		
		if(!this.moveOrderSound.isPlaying) {
			this.moveOrderSound.play();
		}
	},
});