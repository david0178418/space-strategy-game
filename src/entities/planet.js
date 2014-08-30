var ecs = require('ecs/ecs');

module.exports = function(x, y) {
	var planet = ecs.createEntity(x, y, 'planet')
		.addComponent('ownable')
		.addComponent('selectableComponent')
		.addComponent('shipGeneratorComponent');

	planet.smoothed = false;

	return planet;
};

window.planet = module.exports;