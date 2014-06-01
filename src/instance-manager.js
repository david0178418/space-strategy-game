//Really, "Service Locatore"...but whatever...  Using the
//anti-pattern just to get this thing up.
//TODO Organize more neatly so dependecies are known by the interface
define(function(require, exports) {
	"use strict";
	
	//TODO remove debug global
	var instanceManager = window.instanceManager = exports;
		
	var resources = {
		game: {
			init: function() {
				var CONFIG = require('config'),
					Phaser = require('phaser');

				//TODO remove debug global
				return window.game = new Phaser.Game(CONFIG.screen.width, CONFIG.screen.height, Phaser.AUTO, 'phaser');
			},
		},
		
		group: {
			cache: false,
			init: function() {
				return instanceManager.get('game').add.group();
			}
		},
		
		
		//TODO less ghetto way of collecting all targetables
		// since entities can only exist in one group at a time
		playerTargets: {
			init: function() {
				return {
					_lists: [
						instanceManager.get('turrets'),
						instanceManager.get('buildings'),
					],
					forEachAlive: function(callback, context) {
						for(var x = 0; x < this._lists.length; x++) {
							this._lists[x].forEachAlive(callback, context);
						}
					},
				};
			},
		},
		
		//TODO less ghetto way of collecting all targetables
		// since entities can only exist in one group at a time
		enemyTargets: {
			init: function() {
				return {
					_lists: [
						instanceManager.get('meteors'),
						instanceManager.get('ships'),
					],
					forEachAlive: function(callback, context) {
						//TODO less ghetto way of collecting all targetables
						// since entities can only exist in one group at a time
						for(var x = 0; x < this._lists.length; x++) {
							this._lists[x].forEachAlive(callback, context);
						}
					}
				};
			}
		},
		
		turrets: {
			init: function() {
				return instanceManager.get('group');
			},
		},
		
		buildings: {
			init: function() {
				return instanceManager.get('group');
			},
		},
			
		meteors: {
			init: function() {
				return instanceManager.get('group');
			},
		},
			
		ships: {
			init: function() {
				return instanceManager.get('group');
			},
		},
			
		beams: {
			init: function() {
				return instanceManager.get('group');
			},
		},
			
		shipController: {
			init: function() {
				var Ships = require('controllers/ships');
				return new Ships();
			}
		},

		meteorController: {
			init: function() {
				var Meteors = require('controllers/meteors');
				return new Meteors();
			},
		},

		resourceFragments: {
			init: function() {
				var ResourceFragments = require('controllers/resource-fragments');

				return new ResourceFragments();
			},
		},
		
		hud: {
			init: function() {
				var Hud = require('interface/hud');
				return new Hud();
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
				};
			}
		}
	},
		
	instances = {};
		
	exports.get = function(resourceName) {
		var resourceInstance = instances[resourceName];
		
		if(!resourceInstance) {
			resourceInstance = resources[resourceName].init();
			
			if(resources[resourceName].cache || resources[resourceName].cache === undefined) {
				instances[resourceName] = resourceInstance;
			}
		}

		return resourceInstance;
	};
	
	exports.reset = function(dependency) {
		instances[dependency] = resources[dependency]();
	};
});
