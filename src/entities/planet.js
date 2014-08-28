define(function(require) {
	'use strict';
	var _ = require('lodash')
	var EntityBase = require('entity-base');
	var ownableComponent = require('components/ownable');
	var selectableComponent = require('components/selectable');
	var shipGeneratorComponent = require('components/ship-generator');

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