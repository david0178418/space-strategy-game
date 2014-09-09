var ecs = require('ecs/ecs');

module.exports = function(x, y) {
	return ecs.createEntity(x, y, 'probe')
	.addComponent('team')
	.addComponent('selectable')
	.addComponent('cloaking-device')
	.addComponent('movable', {
		speed: 100,
	});
};