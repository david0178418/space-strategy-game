var CONFIG = require('config');
var _ = require('lodash');
var Phaser = require('phaser');
var States = require('states');
var Planet = require('entities/planet');
var Beam = require('entities/beam');
var Hud = require('interface/hud');
var instanceManager = require('instance-manager');
var game = instanceManager.get('game');

States.Play = 'play';
game.state.add(States.Play, {
	
	preload: function(game) {
		Hud.preload(game);
		Beam.preload(game);
		
		game.load.atlas('ships', 'assets/images/ships-spritesheet.png', 'assets/images/ships-atlas.json');
		game.load.atlas('planets', 'assets/images/planets-spritesheet.png', 'assets/images/planets-atlas.json');
		
		game.load.image('ship', 'assets/images/ship.png');
		game.load.image('planet', 'assets/images/planet.png');

		game.load.image('selection', '/assets/images/selection.png', 50, 50);
		game.load.image('waypointMarker', '/assets/images/waypoint.png', 20, 20);
		
		game.load.image('background1-layer1', '/assets/images/backdrop-black-little-spark-black.png', 512, 512);
		game.load.image('background1-layer2', '/assets/images/backdrop-black-little-spark-transparent.png', 512, 512);
	},
	
	create: function(game) {
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.setScreenSize();
		
		game.world.setBounds(0, 0, CONFIG.stage.width, CONFIG.stage.height);
		
		this.ecs = require('ecs/ecs');

		require('systems/registry');

		this.ecs.runSystemInits();
	},
	update: function() {
		

		this.ecs.runSystems();
	},
	
	paused: function() {
	},
});