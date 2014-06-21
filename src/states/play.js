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
		MinSize = 25,
		MaxSize = 300;

	States.Play = 'play';
	game.state.add(States.Play, {
		_zoomSpeed: 25,	//% per second
		_zoomTween: null,
		_zoomTarget: 100,	//%
		_zoomIncrement: 5,	//%
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

				this._zoomTarget += this._zoomIncrement * (e.wheelDelta > 0 ? 1 : -1);

				if(this._zoomTarget >= MinSize && this._zoomTarget <= MaxSize) {
					this.updateZoom();
				}

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
			var controls = this.controls;

			if(controls.panUp.isDown) {
				this.worldEntities.y += PanSpeed;
			} else if(controls.panDown.isDown) {
				this.worldEntities.y -= PanSpeed;
			}

			if(controls.panRight.isDown) {
				this.worldEntities.x -= PanSpeed;
			} else if(controls.panLeft.isDown) {
				this.worldEntities.x += PanSpeed;
			}
		},

		updateZoom: function() {
			var zoom = this._zoomTarget / 100,
				newPivot = this.game.input.getLocalPosition(this.worldEntities, game.input.mousePointer);

			this.worldEntities.position.x += newPivot.x * (this.worldEntities.scale.x - zoom);
			this.worldEntities.position.y += newPivot.y * (this.worldEntities.scale.y - zoom);
			this.worldEntities.scale.setTo(zoom);
		},

		paused: function() {
		},
	});
});
