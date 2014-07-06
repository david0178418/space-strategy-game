define(function(require) {
	"use strict";
	var _ = require('lodash'),
		EntityBase = require('entity-base'),
		damageComponent = require('components/damage'),
		gunComponent = require('components/gun'),
		laserGunComponent = require('components/laser-gun'),
		movementComponent = require('components/movement'),
		ownableComponent = require('components/ownable'),
		selectableComponent = require('components/selectable');
	
	function Ship(props) {
		props.graphic = 'ships';
		EntityBase.call(this, props);
		this.speed = 100;
		this.frame = _.random(1, 75);
	}
	
	Ship.preload = function() {};
	
	Ship.prototype = Object.create(EntityBase.prototype);
	_.extend(Ship.prototype,
			damageComponent,
			gunComponent,
			laserGunComponent,
			movementComponent,
			ownableComponent,
			selectableComponent, {
				constructor: Ship,
				update: function() {
					this.runComponentUpdates();
				},
				rightClickHandler: function(x, y, shiftIsDown) {
					this.moveTo(x, y, shiftIsDown);
				}
			}
		);

	return Ship;
});