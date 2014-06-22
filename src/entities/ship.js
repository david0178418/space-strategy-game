define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		EntityBase = require('entity-base'),
		damageComponent = require('components/damage'),
		gunComponent = require('components/gun'),
		laserGunComponent = require('components/laser-gun'),
		targetClosestComponent = require('components/target-closest'),
		selectableComponent = require('components/selectable'),
		movementComponent = require('components/movement'),
		instanceManager = require('instance-manager');
	
	function Ship(props) {
		props.graphic = 'ship';
		EntityBase.call(this, props);
		this.speed = 100;
	}
	
	Ship.COOLDOWN = 1800;
	Ship.HEALTH = 4;
	Ship.RANGE = 700;
	Ship.DIRECTIONS = {
		EAST: 1,
		WEST: 2,
	};
	
	Ship.preload = function(game) {
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
				},
				rightClickHandler: function(x, y, shiftIsDown) {
					this.moveTo(x, y, shiftIsDown);
				}
			}
		);

	return Ship;
});