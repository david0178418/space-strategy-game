require('ecs/ecs').registerSystem('universe-creation', {
	init: function() {
		var _ = require('lodash');
		var CONFIG = require('config');
		var i;
		var newPlanet;
		var playerPlanet = _.random(0, 14);
		var planet = require('entities/planet');
		var worldEntities = require('instance-manager').get('worldEntities');

		//planets acting as markers to edges and center
		worldEntities.add(planet(0, CONFIG.stage.height / 2));
		worldEntities.add(planet(0, 0));
		worldEntities.add(planet(CONFIG.stage.width / 2, CONFIG.stage.height / 2));
		worldEntities.add(planet(CONFIG.stage.width / 2, 0));
		worldEntities.add(planet(CONFIG.stage.width, CONFIG.stage.height / 2));
		worldEntities.add(planet(CONFIG.stage.width / 2, CONFIG.stage.height));
		worldEntities.add(planet(0, CONFIG.stage.height));
		worldEntities.add(planet(CONFIG.stage.width, 0));
		worldEntities.add(planet(CONFIG.stage.width, CONFIG.stage.height));
		
		for(i = 0; i < CONFIG.universe_size; i++) {
			newPlanet = planet(
				_.random(100, CONFIG.stage.width - 100),
				_.random(100, CONFIG.stage.height - 100)
			);

			if (i === playerPlanet) {

				worldEntities.x = -newPlanet.x + CONFIG.screen.width / 2;
				worldEntities.y = -newPlanet.y + CONFIG.screen.height / 2;

				newPlanet.components.team.name = 'player';

				newPlanet.addComponent('ship-generator', {
					activeGenerator: 0,
					//TODO figure out better way to handle ship production details
					// and button interactions
					options: [
						{
							handler: 'changeProduction',
							label: 'Probe',
							type: require('entities/probe'),
							buildTime: 5000,
							currentUnitBuildTime: 0,
						},{
							handler: 'changeProduction',
							label: 'Fighter',
							type: require('entities/fighter'),
							buildTime: 3000,
							currentUnitBuildTime: 0,
						}, {
							handler: 'changeProduction',
							label: 'Battleship',
							type: require('entities/battleship'),
							buildTime: 5000,
							currentUnitBuildTime: 0,
						}, {
							handler: 'changeProduction',
							label: 'Colony Ship',
							type: require('entities/colony-ship'),
							buildTime: 7000,
							currentUnitBuildTime: 0,
						},
					],
					rallyPoint: {
						x: newPlanet.x + 100,
						y: newPlanet.y + 75,
					},
				});
			}

			worldEntities.add(newPlanet);
		}
	},
});