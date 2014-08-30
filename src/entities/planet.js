var ecs = require('ecs/ecs');

module.exports = function(x, y) {
	return ecs.createEntity({
		graphic: 'planet',
		x: x,
		y: y,
	})
	.addComponent('ownable')
	.addComponent('selectableComponent')
	.addComponent('shipGeneratorComponent');

};