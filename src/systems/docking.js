var _ = require('lodash');

require('ecs/ecs').registerSystem('docking', {
	components: [
		'dock',
	],

	runOne: function(entity) {
		var dockTarget = ecs.getEntityById(entity.components.dock.targetId);
		var cargoSpace = dockTarget.components['ship-bay'].space;
		var dockedShips;

		if(!dockTarget.components['ship-bay'].dockedShips) {
			dockTarget.components['ship-bay'].dockedShips = [];
		}

		var dockedShips = dockTarget.components['ship-bay'].dockedShips;

		_.each(dockedShips, function(ship) {
			cargoSpace -= ship.components.dockable.size;
		});

		if(cargoSpace >= entity.components.dockable.size) {
			//TODO Figure out better way to handle entities that are off screen (in "limbo")
			entity.removeComponent('selected');
			entity.components.selectable.graphic &&
				(entity.components.selectable.graphic.visible = false);
			entity.kill();
			dockedShips.push(entity);
		}

		entity.removeComponent('dock');
	},
});