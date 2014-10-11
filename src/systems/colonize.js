var _ = require('lodash');
var ecs = require('ecs/ecs');

ecs.registerSystem('colonize', {
	components: [
		'colonize',
	],

	runOne: function(entity) {
		var colonizeTarget = entity.components.colonize.target;

		if(!game.physics.arcade.intersects(entity, colonizeTarget)) {
			return;
		}

		colonizeTarget.components.team.name = entity.components.team.name;

		//TODO Figure out how to handle this stuff.
		colonizeTarget.
			addComponent('probe-blueprint', {
				prefab: require('entities/probe'),
				buildTime: 3000,
				currentUnitBuildTime: 0,
			}).
			addComponent('fighter-blueprint', {
				prefab: require('entities/fighter'),
				buildTime: 4000,
				currentUnitBuildTime: 0,
			}).
			addComponent('battleship-blueprint', {
				prefab: require('entities/battleship'),
				buildTime: 6000,
				currentUnitBuildTime: 0,
			}).
			addComponent('colony-ship-blueprint', {
				prefab: require('entities/colony-ship'),
				buildTime: 8000,
				currentUnitBuildTime: 0,
			}).
			addComponent('ship-generator', {
				activeGenerator: 'probe-blueprint',
				rallyPoint: {
					x: colonizeTarget.x + 100,
					y: colonizeTarget.y + 75,
				},
			});

		ecs.destroyEntity(entity);
	},
});