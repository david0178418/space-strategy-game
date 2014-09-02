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
		
		for(i = 0; i < 15; i++) {
			newPlanet = planet(
				_.random(100, CONFIG.stage.width - 100),
				_.random(100, CONFIG.stage.height - 100)
			);

			if (i === playerPlanet) {

				worldEntities.x = -newPlanet.x + CONFIG.screen.width / 2;
				worldEntities.y = -newPlanet.y + CONFIG.screen.height / 2;

				newPlanet.components.ownable.ownedBy = 'player';

				newPlanet.addComponent('ship-generator', {
					activeGenerator: 1,
					//TODO figure out better way to hangle ship production details
					generators: [
						{
							label: 'Fighter',
							type: require('entities/fighter'),
							buildTime: 3000,
							currentUnitBuildTime: 0,
						}, {
							label: 'Battleship',
							type: require('entities/battleship'),
							buildTime: 10000,
							currentUnitBuildTime: 0,
						}
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