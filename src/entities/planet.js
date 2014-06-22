define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		EntityBase = require('entity-base'),
		selectableComponent = require('components/selectable');

	function Planet(props) {
		props.graphic = 'planet';
		EntityBase.call(this, props);
	}
	
	Planet.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(
		Planet.prototype,
		selectableComponent, {
			constructor: Planet,
			update: function() {
			},
		}
	);
	
	window.Planet = Planet;
	return Planet;
});