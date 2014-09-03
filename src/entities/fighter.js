var ecs = require('ecs/ecs');

module.exports = function(x, y) {
	return ecs.createEntity(x, y, 'fighter')
	.addComponent('team')
	.addComponent('selectable')
	.addComponent('movable', {
		speed: 100,
	});
};