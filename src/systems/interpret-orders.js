var _ = require('lodash');
var instanceManager = require('instance-manager');
var game = instanceManager.get('game');

require('ecs/ecs').registerSystem('interpret-orders', {

	components: [
		'issue-order',
	],

	run: function(entities) {
		var entity;
		var i;
		var localPoint = game.input.getLocalPosition(instanceManager.get('worldEntities'), game.input.mousePointer);
		var noMovable = !_.find(entities, function(entity) {
			return entity.hasComponent('movable');
		});

		for(i = 0; i < entities.length; i++) {
			entity = entities[i];

			if(noMovable && entity.hasComponent('ship-generator')) {
				entity.getComponent('ship-generator').rallyPoint = localPoint;
			} else if(entity.components.movable && entity.components.team.name === 'player') {
				entity.components['group-movement'] = {
					override: instanceManager.get('controls').shiftModifier.isDown,
					centralPoint: localPoint,
				};
			}

			entity.removeComponent('issue-order');
		}
	},
});