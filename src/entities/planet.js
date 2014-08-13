define(function(require) {
	"use strict";
	var _ = require('lodash'),
		EntityBase = require('entity-base'),
		ownableComponent = require('components/ownable'),
		selectableComponent = require('components/selectable'),
		shipGeneratorComponent = require('components/ship-generator');

	function Planet(props) {
		props.graphic = 'planet';
		EntityBase.call(this, props);
	}
	
	Planet.prototype = Object.create(EntityBase.prototype);
	_.extend(
		Planet.prototype,
		ownableComponent,
		selectableComponent,
		shipGeneratorComponent, {
			constructor: Planet,
			update: function() {
				this.runComponentUpdates();
			},
		}
	);
	
	return Planet;
});