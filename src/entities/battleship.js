var ecs = require('ecs/ecs');

module.exports = function(x, y) {
	return ecs.createEntity(x, y, 'battleship')

		.addComponent('team')
		.addComponent('selectable')
		.addComponent('hyperdrive', {
			chargeTime: 5000,
			timeCharged: 0,
		})
		.addComponent('movable', {
			speed: 50,
		});
};