define(function(require) {
	"use strict";
	var _ = require('lodash'),
		States = require('states'),
		instanceManager = require('instance-manager'),
		game = instanceManager.get('game');
	
	require('states/play');

	return function() {
		game.state.start(States.Play);
		_.defer(function() {
			game.canvas.addEventListener('contextmenu', function (e) {
				e.preventDefault();
			});
		});
	};
});