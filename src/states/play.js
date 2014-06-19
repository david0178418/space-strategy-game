define(function(require) {
	"use strict";
	var CONFIG = require('config'),
		_ = require('lodash'),
		Phaser = require('phaser'),
		States = require('states'),
		Planet = require('entities/planet'),
		Beam = require('entities/beam'),
		Ship = require('entities/ship'),
		Hud = require('interface/hud'),
		DragSelection = require('interface/drag-selection'),
		instanceManager = require('instance-manager'),
		game = instanceManager.get('game');
	
	var PanSpeed = 8,
		MinSize = 0.25,
		MaxSize = 3,
		ScaleIncrement = 0.05;
	
	States.Play = 'play';
	game.state.add(States.Play, {
		_zoomSpeed: 25,	//% per second
		_zoomTween: null,
		_zoomTarget: 1,
		
		worldEntities: null,
		
		preload: function(game) {
			Hud.preload(game);
			Beam.preload(game);
		},
		create: function(game) {
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			game.scale.setScreenSize();
			window.worldEntities = this.worldEntities = instanceManager.get('worldEntities');
			
			window.addEventListener('mousewheel', _.bind(function(e) {
				if(game.paused) {
					return;
				}
				
				this._zoomTarget += ScaleIncrement * (e.wheelDelta > 0 ? 1 : -1);
				this._zoomTarget = Phaser.Math.clamp(this._zoomTarget, 0.25, 2);
			}, this));

			game.world.setBounds(0, 0, CONFIG.stage.width, CONFIG.stage.height);
			
			game.stage.backgroundColor = '#333';
			
			this.planet1 = new Planet({x: 0, y: 0});
			this.planet2 = new Planet({x: 0, y: CONFIG.stage.height / 2});
			
			this.ship1 = new Ship({x: 100, y: 100});
			this.ship2 = new Ship({x: 150, y:150});
			
			this.worldEntities.add(this.planet1);
			this.worldEntities.add(this.planet2);
			this.worldEntities.add(new Planet({x: CONFIG.stage.width / 2, y: CONFIG.stage.height / 2}));
			this.worldEntities.add(new Planet({x: CONFIG.stage.width / 2, y: 0}));
			this.worldEntities.add(new Planet({x: CONFIG.stage.width, y: CONFIG.stage.height / 2}));
			this.worldEntities.add(new Planet({x: CONFIG.stage.width / 2, y: CONFIG.stage.height}));
			this.worldEntities.add(new Planet({x: 0, y: CONFIG.stage.height}));
			this.worldEntities.add(new Planet({x: CONFIG.stage.width, y: 0}));
			this.worldEntities.add(new Planet({x: CONFIG.stage.width, y: CONFIG.stage.height}));
			this.worldEntities.add(this.ship1);
			this.worldEntities.add(this.ship2);
			
			this.dragSelection = new DragSelection(this.select);
			this.controls = instanceManager.get('controls');
		},
		update: function(game) {
			if(this.worldEntities.scale.x !== this._zoomTarget) {
				this.deltaTime = game.time.elapsed;
				this.updateZoom();
			}
			var controls = this.controls;
			
			if(controls.panUp.isDown) {
				game.camera.y -= PanSpeed;
			} else if(controls.panDown.isDown) {
				game.camera.y += PanSpeed;
			}
			
			if(controls.panRight.isDown) {
				game.camera.x += PanSpeed;
			} else if(controls.panLeft.isDown) {
				game.camera.x -= PanSpeed;
			}
		},
		
		updateZoom: function() {
			//TODO figure out math to transition smoothly
			this.worldEntities.scale.x = this.worldEntities.scale.y = this._zoomTarget;
			
			this.worldEntities.x = this.game.world.width * ( 1 - this._zoomTarget) * 0.5;
			this.worldEntities.y = this.game.world.height * ( 1 - this._zoomTarget) * 0.5;
		},
		
		paused: function() {
		},
	});
});