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
		_zoomMin: 15,
		_panSpeed: 8,
		_zoomTween: null,
		_zoomTarget: 100,	//%
		_zoomIncrement: 5,	//%
		worldEntities: null,
		
		preload: function(game) {
			Hud.preload(game);
			Beam.preload(game);
			
			game.load.image('background1-layer1', '/assets/images/backdrop-black-little-spark-black.png', 512, 512);
			game.load.image('background1-layer2', '/assets/images/backdrop-black-little-spark-transparent.png', 512, 512);
			
			game.load.image('background2-layer1', '/assets/images/parallax100.png', 500, 500);
			game.load.image('background2-layer2', '/assets/images/parallax80.png', 500, 500);
			game.load.image('background2-layer3', '/assets/images/parallax60.png', 500, 500);
			
			// Temp render functions
			game.load.spritesheet('planet', renderPlanet(game), 100, 100);
			game.load.spritesheet('ship', renderShip(game), 40, 30);
		},
		
		create: function(game) {
			this.background1layer1 = game.add.tileSprite(CONFIG.screen.width * -0.25, CONFIG.screen.width * -0.25, CONFIG.screen.width * 1.25, CONFIG.screen.width * 1.25, 'background1-layer1');
			this.background1layer2 = game.add.tileSprite(CONFIG.screen.width * -0.5, CONFIG.screen.width * -0.5, CONFIG.screen.width * 1.5, CONFIG.screen.width * 1.5, 'background1-layer2');
			
			/*this.background2layer1 = game.add.tileSprite(CONFIG.screen.width * -0.25, CONFIG.screen.width * -0.25, CONFIG.screen.width * 1.25, CONFIG.screen.width * 1.25, 'background2-layer1');
			this.background2layer2 = game.add.tileSprite(CONFIG.screen.width * -0.5, CONFIG.screen.width * -0.5, CONFIG.screen.width * 1.5, CONFIG.screen.width * 1.5, 'background2-layer2');
			this.background2layer3 = game.add.tileSprite(CONFIG.screen.width * -0.75, CONFIG.screen.width * -0.75, CONFIG.screen.width * 1.75, CONFIG.screen.width * 1.75, 'background2-layer3');*/
			
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

			}, this));

			game.world.setBounds(0, 0, CONFIG.stage.width, CONFIG.stage.height);
			
			
			
			this.worldEntities.add(new Ship({x: 100, y: 100, ownedBy: 'player'}));
			this.worldEntities.add(new Ship({x: 150, y:150}));
			this.worldEntities.add(new Ship({x: 50, y: 150}));
			this.worldEntities.add(new Ship({x: 150, y:50, }));
			
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
			
			this.background1layer1.position.x = this.background1layer1.width * 0.005  * this.worldEntities.x / game.width;
			this.background1layer1.position.y = this.background1layer1.height * 0.005 * this.worldEntities.y / game.height;
			this.background1layer2.position.x = this.background1layer2.width * 0.01 * this.worldEntities.x / game.width;
			this.background1layer2.position.y = this.background1layer2.height * 0.01* this.worldEntities.y / game.height;
			
			
			/*this.background2layer1.position.x = this.background2layer1.width * .001  * this.worldEntities.x / game.width;
			this.background2layer1.position.y = this.background2layer1.height * .001 * this.worldEntities.y / game.height;
			this.background2layer2.position.x = this.background2layer2.width * .01 * this.worldEntities.x / game.width;
			this.background2layer2.position.y = this.background2layer2.height * .01* this.worldEntities.y / game.height;
			this.background2layer3.position.x = this.background2layer3.width * .02 * this.worldEntities.x / game.width;
			this.background2layer3.position.y = this.background2layer3.height * .02* this.worldEntities.y / game.height;*/
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
		
		return ship.canvas.toDataURL();
	}
	
	function renderPlanet() {
		var planet = game.add.bitmapData(100, 100, 'ship', true);
		
		planet.context.beginPath();
		planet.context.setLineWidth(5);
		planet.context.strokeStyle = "#0093ff";
		planet.context.fillStyle = "#0ffda7";
		planet.context.arc(50, 50, 45, 0, 2 * Math.PI);
		planet.context.stroke();
		planet.context.fill();
		
		return planet.canvas.toDataURL();
	}
});
