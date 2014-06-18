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
		ScaleIncrement = 0.25;
	
	States.Play = 'play';
	game.state.add(States.Play, {
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
				this._zoomTarget += ScaleIncrement * (e.wheelDelta > 0 ? 1 : -1);
				
				if(this._zoomTarget < MinSize || this._zoomTarget > MaxSize) {
					return;
				}
				
				if(this._zoomTween) {
					this._zoomTween.stop();
				}
				
				this._zoomTween = game.add.tween(this.worldEntities.scale).to({x:this._zoomTarget, y:this._zoomTarget}, 200);
				
				this._zoomTween.start();
			}, this));

			game.world.setBounds(0, 0, CONFIG.stage.width, CONFIG.stage.height);
			
			game.stage.backgroundColor = '#333';
			
			this.planet1 = new Planet({x: 500, y: 500});
			this.planet2 = new Planet({x: 400, y: 600});
			
			this.ship1 = new Ship({x: 100, y: 100});
			this.ship2 = new Ship({x: 150, y:150});
			
			this.worldEntities.add(this.planet1);
			this.worldEntities.add(this.planet2);
			this.worldEntities.add(this.ship1);
			this.worldEntities.add(this.ship2);
			
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