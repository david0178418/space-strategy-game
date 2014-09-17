var _ = require('lodash');

require('ecs/ecs').registerSystem('cloaking-device', {
	components: [
		'cloaking-device',
		'selected',
	],

	run: function() {

	},
});