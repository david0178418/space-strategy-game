define(function(require) {
	"use strict";
	var Beam = require('entities/beam');
	
	return {
		fireAt: function(target) {
			var beam = Beam.create();

			beam.fire(this.x + this._gunOffsetX, this.y + this._gunOffsetY, target.x, target.y);
			target.damage(1);
			this.gunFired();
		},
	};
});