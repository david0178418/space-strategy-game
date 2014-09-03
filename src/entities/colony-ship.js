var ecs = require('ecs/ecs');

module.exports = function(x, y) {
	return ecs.createEntity(x, y, 'colony-ship')
	.addComponent('team')
	.addComponent('selectable')
	.addComponent('colonizer')
	.addComponent('movable', {
		speed: 20,
	});
};