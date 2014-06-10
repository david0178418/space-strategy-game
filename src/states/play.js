define(function(require) {
	"use strict";
	var CONFIG = require('config'),
		Phaser = require('phaser'),
		States = require('states'),
		Meteors = require('controllers/meteors'),
		Building = require('entities/building'),
		Planet = require('entities/planet'),
		Beam = require('entities/beam'),
		Ship = require('entities/ship'),
		Hud = require('interface/hud'),
		DragSelection = require('interface/drag-selection'),
		instanceManager = require('instance-manager'),
		resourceFragments,
		game = instanceManager.get('game');
	
	var PanSpeed = 8;
	
	States.Play = 'play';
	game.state.add(States.Play, {
		preload: function(game) {
			Building.preload(game);
			Meteors.preload(game);
			Hud.preload(game);
			Beam.preload(game);
		},
		create: function(game) {
			resourceFragments = instanceManager.get('resourceFragments');
			game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
			game.scale.setShowAll();
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVeritcally = true;
			game.scale.refresh();

			window.addEventListener('resize', function() {
				game.scale.setShowAll();
				game.scale.refresh();
			});

			game.world.setBounds(0, 0, CONFIG.stage.width, CONFIG.stage.height);
			
			game.stage.backgroundColor = '#333';
			
			this.planet1 = new Planet({x: 500, y: 500});
			this.planet2 = new Planet({x: 400, y: 600});
			
			this.ship1 = new Ship({x: 100, y: 100});
			this.ship2 = new Ship({x: 150, y:150});
			
			this.dragSelection = new DragSelection(this.select);
			this.controls = instanceManager.get('controls');
		},
		update: function(game) {
			var controls = this.controls;
			
			if(controls.panUp.isDown) {
				this.game.camera.y -= PanSpeed;
			} else if(controls.panDown.isDown) {
				this.game.camera.y += PanSpeed;
			}
			
			if(controls.panRight.isDown) {
				this.game.camera.x += PanSpeed;
			} else if(controls.panLeft.isDown) {
				this.game.camera.x -= PanSpeed;
			}
		},
		paused: function() {
		},
	});
});