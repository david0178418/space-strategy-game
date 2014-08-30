require('ecs/ecs').registerSystem('universe-creation', {
	init: function() {
		var _ = require('lodash');
		var CONFIG = require('config');
		var i;
		var Planet = require('entities/planet');
		var worldEntities = require('instance-manager').get('worldEntities');

		//planets acting as markers to edges and center
		worldEntities.add(Planet(0, CONFIG.stage.height / 2));
		worldEntities.add(Planet(0, 0));
		worldEntities.add(Planet(CONFIG.stage.width / 2, CONFIG.stage.height / 2));
		worldEntities.add(Planet(CONFIG.stage.width / 2, 0));
		worldEntities.add(Planet(CONFIG.stage.width, CONFIG.stage.height / 2));
		worldEntities.add(Planet(CONFIG.stage.width / 2, CONFIG.stage.height));
		worldEntities.add(Planet(0, CONFIG.stage.height));
		worldEntities.add(Planet(CONFIG.stage.width, 0));
		worldEntities.add(Planet(CONFIG.stage.width, CONFIG.stage.height));
		
		for(i = 0; i < 15; i++) {
			worldEntities.add(Planet({
				x: _.random(100, CONFIG.stage.width - 100),
				y: _.random(100, CONFIG.stage.height - 100),
			}));
		}
	},
});