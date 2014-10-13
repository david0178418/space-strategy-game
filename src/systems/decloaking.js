require('ecs/ecs').registerSystem('decloaking-device', {
	components: [
		'cloaking-device',
		'decloaking',
	],

	runOne: function(entity) {
		entity.alpha = 1;
		entity.removeComponent('decloaking');
	},
});