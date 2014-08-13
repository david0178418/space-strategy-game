define(function(require) {
	"use strict";
	var _ = require('lodash'),
		EntityBase = require('entity-base'),
		damageComponent = require('components/damage'),
		movementComponent = require('components/movement'),
		ownableComponent = require('components/ownable'),
		selectableComponent = require('components/selectable');
	
	function ShipBase(props) {
		props.graphic = 'ship';
		EntityBase.call(this, props);
	}
	
	ShipBase.preload = function() {};
	
	ShipBase.prototype = Object.create(EntityBase.prototype);
	_.extend(ShipBase.prototype,
		damageComponent,
		movementComponent,
		ownableComponent,
		selectableComponent, {
			constructor: ShipBase,
			update: function() {
				this.runComponentUpdates();
			},
			rightClickHandler: function(x, y, shiftIsDown) {
				this.moveTo(x, y, shiftIsDown);
			}
		}
	);

	return ShipBase;
});