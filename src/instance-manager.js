//Really, "Service Locator"...but whatever...  Using the
//anti-pattern just to get this thing up.
//TODO Organize more neatly so dependecies are known by the interface
//TODO remove debug global
var instances = {};

var instanceManager = {
	get: function(resourceName) {
		var resourceInstance = instances[resourceName];
		
		if(!resourceInstance) {
			resourceInstance = resources[resourceName].init();
			
			if(resources[resourceName].cache || resources[resourceName].cache === undefined) {
				instances[resourceName] = resourceInstance;
			}
		}

		return resourceInstance;
	},
	reset: function(dependency) {
		instances[dependency] = resources[dependency]();
	}
};
	
var resources = {
		
	beams: {
		init: function() {
			return instanceManager.get('group');
		},
	},

	controls: {
		init: function() {
			var Phaser = require('phaser'),
				KeyCodes = Phaser.Keyboard,
				game = instanceManager.get('game'),
				keyboard = game.input.keyboard;
			return {
				panUp: keyboard.addKey(KeyCodes.W),
				panRight: keyboard.addKey(KeyCodes.D),
				panDown: keyboard.addKey(KeyCodes.S),
				panLeft: keyboard.addKey(KeyCodes.A),
				shiftModifier: keyboard.addKey(KeyCodes.SHIFT),
			};
		}
	},
	
	game: {
		init: function() {
			var CONFIG = require('config');
			var Phaser = require('phaser');

			//TODO remove debug global
			window.game = new Phaser.Game(CONFIG.screen.width, CONFIG.screen.height, Phaser.AUTO, 'phaser', undefined, false);
			return window.game;
		},
	},
	
	group: {
		cache: false,
		init: function() {
			return instanceManager.get('game').add.group();
		}
	},
	
	hud: {
		init: function() {
			var Hud = require('interface/hud');
			return new Hud();
		},
	},
	
	ships: {
		init: function() {
			return instanceManager.get('group');
		},
	},

	uiViewModel: {
		init: function() {
			var ko = require('knockout');
			var viewModel = {
				component: ko.observable(''),
				options: ko.observableArray([]),
				selectedOption: ko.observable(),
				showProductionOptions: ko.observable(false),
			};
			
			ko.applyBindings(viewModel);
			//TODO: Remove global debug;
			window.viewModel = viewModel;
			return viewModel;
		}
	},
	
	worldEntities: {
		init: function() {
			//TODO: Remove global debug
			var worldEntities = window.worldEntities = instanceManager.get('group');
			
			return worldEntities;
		}	
	},
};

module.exports = instanceManager;

// TODO remove debug
window.instanceManager = instanceManager;