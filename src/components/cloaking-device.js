require('ecs/ecs').registerComponent('cloaking-device', {
	options: [
		{
			handler: 'cloak',
			label: 'Cloak',
		}, {
			handler: 'decloak',
			label: 'Decloak',
		},
	],
});