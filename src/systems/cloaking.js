var _ = require('lodash');

require('ecs/ecs').registerSystem('cloaking-device', {
	components: [
		'cloaking-device',
		'cloaking',
	],

	runOne: function(entity) {
		entity.alpha = 0.3;
		entity.removeComponent('cloaking');
	},
});