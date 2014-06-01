define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		instanceManager = require('instance-manager'),
		selectable = require('components/selectable');

	function Planet(props) {
		var game = instanceManager.get('game');
		Phaser.Sprite.call(this, game, props.x, props.y, 'planet');
		
		// XXX TEMP SIZE FOR PLACEHOLDER
		this.width = 50;
		this.height = 50;
		// END
		
		this.anchor.setTo(0.5, 0.5);
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.initSelectable();
		game.add.existing(this);
	}
	
	Planet.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(
		Planet.prototype,
		selectable, {
			constructor: Planet,
		}
	);
	
	window.Planet = Planet;
	return Planet;
});