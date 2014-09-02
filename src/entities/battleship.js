var ecs = require('ecs/ecs');

module.exports = function(x, y) {
	return ecs.createEntity(x, y, 'battleship')
	.addComponent('ownable')
	.addComponent('selectable')
	.addComponent('movable', {
		speed: 50,
	});
};