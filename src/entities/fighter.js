var ecs = require('ecs/ecs');

module.exports = function(x, y) {
	return ecs.createEntity(x, y, 'fighter', true)
		.addComponent('dockable', {
			size: 10,
		})
		.addComponent('team')
		.addComponent('selectable')
		.addComponent('movable', {
			speed: 100,
		});
};