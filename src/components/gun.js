define(function(require) {
	"use strict";
	
	return {
		_coolDown:1000,
		_lastFire: 0,
		_gunOffsetX: 0,
		_gunOffsetY: 0,

		gunReady: function() {
			return this.game.time.now - this._lastFire > this._coolDown;
		},

		gunFired: function() {
			this._lastFire = this.game.time.now;
		},
	};
});