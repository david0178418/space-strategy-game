define(function(require) {
	"use strict";
	var CONFIG = require('config'),
		_ = require('lodash'),
		Phaser = require('phaser'),
		States = require('states'),
		Planet = require('entities/planet'),
		Beam = require('entities/beam'),
		Hud = require('interface/hud'),
		DragSelection = require('interface/drag-selection'),
		instanceManager = require('instance-manager'),
		game = instanceManager.get('game');

	States.Play = 'play';
	game.state.add(States.Play, {
		_zoomMax: 300,
		_zoomMin: 15,
		_panSpeed: 8,
		_zoomTween: null,
		_zoomTarget: 100,	//%
		_zoomIncrement: 5,	//%
		worldEntities: null,
		
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
			this.background1layer1 = game.add.tileSprite(CONFIG.screen.width * -0.25, CONFIG.screen.width * -0.25, CONFIG.screen.width * 1.25, CONFIG.screen.width * 1.25, 'background1-layer1');
			this.background1layer2 = game.add.tileSprite(CONFIG.screen.width * -0.5, CONFIG.screen.width * -0.5, CONFIG.screen.width * 1.5, CONFIG.screen.width * 1.5, 'background1-layer2');
			
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
				} else {
					this._zoomTarget = e.wheelDelta > 0 ? this._zoomMax : this._zoomMin;
				}
				
				this.limitView();
				this.updateBackground();

			}, this));

			game.world.setBounds(0, 0, CONFIG.stage.width, CONFIG.stage.height);
			
			//planets acting as markers to edges and center
			this.worldEntities.add(new Planet({x: 0, y: CONFIG.stage.height / 2}));
			this.worldEntities.add(new Planet({x: 0, y: 0}));
			this.worldEntities.add(new Planet({x: CONFIG.stage.width / 2, y: CONFIG.stage.height / 2}));
			this.worldEntities.add(new Planet({x: CONFIG.stage.width / 2, y: 0}));
			this.worldEntities.add(new Planet({x: CONFIG.stage.width, y: CONFIG.stage.height / 2}));
			this.worldEntities.add(new Planet({x: CONFIG.stage.width / 2, y: CONFIG.stage.height}));
			this.worldEntities.add(new Planet({x: 0, y: CONFIG.stage.height}));
			this.worldEntities.add(new Planet({x: CONFIG.stage.width, y: 0}));
			this.worldEntities.add(new Planet({x: CONFIG.stage.width, y: CONFIG.stage.height}));
			
			generatePlanets();

			this.dragSelection = new DragSelection(this.select);
			this.controls = instanceManager.get('controls');
		},
		update: function(game) {
			var dirtyBackground = false;
			
			// Vertial pan
			if(this.controls.panUp.isDown) {
				dirtyBackground = true;
				this.worldEntities.y += this._panSpeed;
			} else if(this.controls.panDown.isDown) {
				dirtyBackground = true;
				this.worldEntities.y -= this._panSpeed;
			}

			// Horizontal pa
			if(this.controls.panRight.isDown) {
				dirtyBackground = true;
				this.worldEntities.x -= this._panSpeed;
			} else if(this.controls.panLeft.isDown) {
				dirtyBackground = true;
				this.worldEntities.x += this._panSpeed;
			}
			
			if(!dirtyBackground) {
				return;
			}
			
			this.limitView();
			
			this.updateBackground();
			this.updateZoom();
		},
		
		limitView: function() {
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
		
		updateBackground: function() {
			this.background1layer1.position.x = this.background1layer1.width * 0.005  * this.worldEntities.x / this.game.width;
			this.background1layer1.position.y = this.background1layer1.height * 0.005 * this.worldEntities.y / this.game.height;
			this.background1layer2.position.x = this.background1layer2.width * 0.01 * this.worldEntities.x / this.game.width;
			this.background1layer2.position.y = this.background1layer2.height * 0.01* this.worldEntities.y / this.game.height;
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
	
	
	function generatePlanets() {
		var i,
			worldEntities = instanceManager.get('worldEntities');
		
		for(i = 0; i < 15; i++) {
			worldEntities.add(new Planet({
				x: _.random(100, CONFIG.stage.width - 100),
				y: _.random(100, CONFIG.stage.height - 100),
			}));
		}
	}
});
