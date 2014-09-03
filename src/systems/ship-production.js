var _ = require('lodash');

require('ecs/ecs').registerSystem('ship-production', {
	components: [
		'ship-generator',
	],
	
	init: function() {
		var instanceManager = require('instance-manager');
		this.worldEntities = instanceManager.get('worldEntities');
		this.game = instanceManager.get('game');
	},
	
	runOne: function(entity) {
		var newShip;
		var shipGenerator = entity.getComponent('ship-generator');
		var activeGenerator = shipGenerator.generators[shipGenerator.activeGenerator];

		activeGenerator.currentUnitBuildTime += this.game.time.elapsed;
		
		if(activeGenerator.currentUnitBuildTime >= activeGenerator.buildTime) {
			activeGenerator.currentUnitBuildTime = 0;
			newShip = activeGenerator.type(entity.x, entity.y);
			newShip.components.team.name = entity.components.team.name;
			
			// TODO Figure out why rally point reference is being copied
			// even though deep cloning
			newShip.addComponent('waypoints', {
				queued: [_.cloneDeep(shipGenerator.rallyPoint)],
			});
			
			this.worldEntities.add(newShip);
		}
	},
});