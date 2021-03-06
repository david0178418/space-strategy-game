var CONFIG = require('config');
var Phaser = require('phaser');
var States = require('states');
var instanceManager = require('instance-manager');
var game = instanceManager.get('game');

States.Play = 'play';
game.state.add(States.Play, {

	preload: function(game) {
		game.load.image('battleship', 'assets/images/battleship.png');
		game.load.image('colony-ship', 'assets/images/colony-ship.png');
		game.load.image('fighter', 'assets/images/fighter.png');
		game.load.image('planet', 'assets/images/planet.png');
		game.load.image('probe', 'assets/images/probe.png');

		game.load.image('selection', '/assets/images/selection.png', 50, 50);
		game.load.image('waypointMarker', '/assets/images/waypoint.png', 20, 20);

		game.load.image('background1-layer1', '/assets/images/backdrop-black-little-spark-black.png', 512, 512);
		game.load.image('background1-layer2', '/assets/images/backdrop-black-little-spark-transparent.png', 512, 512);

		game.load.audio( 'move-order', '/assets/audio/move-order.ogg');
		game.load.audio( 'lasting-hope', '/assets/audio/bgm-lasting-hope.mp3');
	},

	create: function(game) {
		game.scale.setShowAll();

		window.addEventListener('resize', function(e) {
		game.scale.setShowAll();
			game.scale.refresh();
		});
		game.world.setBounds(0, 0, CONFIG.stage.width, CONFIG.stage.height);
		game.scale.refresh();
		this.ecs = require('ecs/ecs');

		require('components/registry');
		require('systems/registry');

		this.mouseControl = require('interface/mouse-control');
		this.ecs.runSystemInits();

		this.bgm = game.add.audio('lasting-hope');
		this.bgm.loop = true;
		this.bgm.play();

		this.mouseControl.init();
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
	},
	update: function() {
		this.mouseControl.update();
		this.ecs.runSystems();

	},

	paused: function() {
	},
});
