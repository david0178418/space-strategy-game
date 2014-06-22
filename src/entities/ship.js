define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		EntityBase = require('entity-base'),
		damageComponent = require('components/damage'),
		gunComponent = require('components/gun'),
		laserGunComponent = require('components/laser-gun'),
		movementComponent = require('components/movement'),
		ownableComponent = require('components/ownable'),
		selectableComponent = require('components/selectable');
	
	function Ship(props) {
		props.graphic = 'ship';
		EntityBase.call(this, props);
		this.speed = 100;
	}
	
	Ship.preload = function() {};
	
	Ship.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(Ship.prototype,
			damageComponent,
			gunComponent,
			laserGunComponent,
			movementComponent,
			ownableComponent,
			selectableComponent, {
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