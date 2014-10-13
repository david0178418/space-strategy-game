var _ = require('lodash');

require('ecs/ecs').registerSystem('scramble', {
	components: [
		'scramble',
	],

	runOne: function(entity) {
		var scrambleTarget = entity.components.scramble.target;

		_.each(entity.components['ship-bay'].dockedShips, function(ship) {
			ship.position.setTo(entity.x, entity.y);
			ship.addComponent('group-movement', {
				centralPoint: {
					x: scrambleTarget.x,
					y: scrambleTarget.y,
				}
			});
			ship.revive();
		});

		entity.removeComponent('scramble');
	},
});