var _ = require('lodash');
var EntityBase = require('entity-base');
var damageComponent = require('components/damage');
var movementComponent = require('components/movement');
var ownableComponent = require('components/ownable');
var selectableComponent = require('components/selectable');

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

module.exports = ShipBase;