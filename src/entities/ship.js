define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		damageComponent = require('components/damage'),
		gunComponent = require('components/gun'),
		laserGunComponent = require('components/laser-gun'),
		targetClosestComponent = require('components/target-closest'),
		selectableComponent = require('components/selectable'),
		movementComponent = require('components/movement'),
		instanceManager = require('instance-manager');
	
	function Ship(props) {
		var game = instanceManager.get('game');
		Phaser.Sprite.call(this, game, props.x, props.y, 'ship');
		
		// XXX TEMP SIZE FOR PLACEHOLDER
		this.width = 10;
		this.height = 10;
		// END
		
		this.anchor.setTo(0.5, 0.5);
		//this.revive(Ship.HEALTH);
		
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.initSelectable();
		
		this.moveTween = this.game.add.tween(this);
		this.speed = 100
		game.add.existing(this);
	}
	
	Ship.COOLDOWN = 1800;
	Ship.HEALTH = 4;
	Ship.RANGE = 700;
	Ship.DIRECTIONS = {
		EAST: 1,
		WEST: 2,
	};
	
	Ship.preload = function(game) {
		game.load.image('ship', '');
	};
	
	Ship.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(Ship.prototype,
			damageComponent, 
			gunComponent,
			laserGunComponent,
			movementComponent,
			selectableComponent,
			targetClosestComponent, {
				constructor: Ship,
				update: function() {
					/*if(this.isDead()) {
						this.kill();
						return;
					}

					if(this.gunReady()) {
					}*/
					this.updateSelectionGraphic();
				},
				rightClickHandler: function(x, y) {
					this.moveTo(x, y);
				}
			}
		);

	return Ship;
});