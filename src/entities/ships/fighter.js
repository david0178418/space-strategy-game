var _ = require('lodash');
var ShipBase = require('entities/ships/ship-base');

function Fighter(props) {
	props.graphic = 'ship';
	ShipBase.call(this, props);
	
	this.speed = 100;
}

Fighter.preload = function() {};

Fighter.prototype = Object.create(ShipBase.prototype);
_.extend(Fighter.prototype,
	{
		constructor: Fighter,
	}
);

module.exports = Fighter;