var _ = require('lodash');
var instanceManager = require('instance-manager');
var game = instanceManager.get('game');

require('ecs/ecs').registerSystem('orders-interpretation', {

	components: [
		'issue-order',
	],

	run: function(entities) {
		var localPoint = game.input.getLocalPosition(instanceManager.get('worldEntities'), game.input.mousePointer);
		var noMovable = !_.find(entities, function(entity) {
			return entity.hasComponent('movable');
		});

		_.each(entities, function(entity) {
			if(noMovable && entity.hasComponent('ship-generator')) {
				entity.getComponent('ship-generator').rallyPoint = localPoint;
			} else if(entity.components.movable && entity.components.team.name === 'player') {
				entity.components['group-movement'] = {
					override: instanceManager.get('controls').shiftModifier.isDown,
					centralPoint: localPoint,
				};
			}

			entity.removeComponent('issue-order');
		});
	},
});