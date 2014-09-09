require('ecs/ecs').registerComponent('movable', {
	speed: 0,
	options: [
		{
			label: 'Cloak',
		},{
			label: 'Decloak',
		}
	]
});