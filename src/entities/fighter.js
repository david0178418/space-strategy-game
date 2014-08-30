var ecs = require('ecs/ecs');

module.exports = function(x, y) {
	return ecs.createEntity({
		graphic: 'ship',
		x: x,
		y: y,
	})
	.addComponent('ownable')
	.addComponent('selectable')
	.addComponent('movable', {
		speed: 100,
	});
};