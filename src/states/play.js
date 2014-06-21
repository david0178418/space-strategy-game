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

	States.Play = 'play';
	game.state.add(States.Play, {
		_zoomMax: 300,
		_zoomMin: 25,
		_panSpeed: 8,
		_zoomSpeed: 25,	//% per second
		_zoomTween: null,
		_zoomTarget: 100,	//%
		_zoomIncrement: 5,	//%
		worldEntities: null,
		
		preload: function(game) {
			Hud.preload(game);
			Beam.preload(game);
			Ship.preload(game);
			
			// Temp render functions
			renderShip(game);
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

				if(this._zoomTarget >= this._zoomMin && this._zoomTarget <= this._zoomMax) {
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
			// Vertial pan
			if(this.controls.panUp.isDown) {
				this.worldEntities.y += this._panSpeed;
			} else if(this.controls.panDown.isDown) {
				this.worldEntities.y -= this._panSpeed;
			}

			// Horizontal pa
			if(this.controls.panRight.isDown) {
				this.worldEntities.x -= this._panSpeed;
			} else if(this.controls.panLeft.isDown) {
				this.worldEntities.x += this._panSpeed;
			}
			
			// Limit view
			// Run check each tick to account for
			// other position mutators such as zooming
			if(this.worldEntities.y > 0) {
				this.worldEntities.y = 0;
			} else if(this.worldEntities.y < -(this.world.height * this.worldEntities.scale.y - game.camera.height)) {
				this.worldEntities.y = -(this.world.height * this.worldEntities.scale.y - game.camera.height);
			}
			
			if(this.worldEntities.x < -(this.world.width * this.worldEntities.scale.x - game.camera.width)) {
				this.worldEntities.x = -(this.world.width * this.worldEntities.scale.x - game.camera.width);
			} else if(this.worldEntities.x > 0) {
				this.worldEntities.x = 0;
			}
		},

		updateZoom: function() {
			var zoom = this._zoomTarget / 100,
				localPosition = this.game.input.getLocalPosition(this.worldEntities, game.input.mousePointer);

			this.worldEntities.position.x += localPosition.x * (this.worldEntities.scale.x - zoom);
			this.worldEntities.position.y += localPosition.y * (this.worldEntities.scale.y - zoom);
			this.worldEntities.scale.setTo(zoom);
		},

		paused: function() {
		},
	});
	
	//Dummy graphics rendering functions
	function renderShip(game) {
		var ship = game.add.bitmapData(40, 30, 'ship', true);
		
		ship.context.beginPath();
		ship.context.setLineWidth(2);
		ship.context.strokeStyle = "#eeeeee";
		ship.context.lineTo(25, 0);
		ship.context.lineTo(0, 0)
		ship.context.lineTo(0, 30);
		ship.context.lineTo(25, 30);
		ship.context.lineTo(0, 30);
		ship.context.lineTo(40, 15);
		ship.context.lineTo(0, 0);
		ship.context.stroke();
		
		ship.context.beginPath();
		ship.context.fillStyle = "#444444";
		ship.context.lineTo(40, 15);
		ship.context.lineTo(0, 30);
		ship.context.lineTo(0, 0);
		ship.context.lineTo(40, 15);
		
		ship.context.fill();
	}
});
