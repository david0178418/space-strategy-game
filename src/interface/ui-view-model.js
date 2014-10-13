var _ = require('lodash');
var ecs = require('ecs/ecs');
var ko = require('knockout');
var instanceManager = require('instance-manager');
var game = instanceManager.get('game');
var worldEntities = instanceManager.get('worldEntities');

var interface;
var setActiveShipGenerator = function(generator) {
	_.each(ecs.getEntities('selected'), function(entity) {
		entity.components['ship-generator'].activeGenerator = generator;
	})
}
var getEntitesAt = function(x, y) {
	var entities = ecs.getEntities();
	return _.filter(entities, function() {
		return entity.containPoint(x, y);
	});
};
var getTopEntityAt = function(position) {
	var entities = ecs.getEntities();
	var topEntity;

	_.each(entities, function(entity) {
		if(entity.containsPoint(position.x, position.y) && (!topEntity || topEntity.z < entity.z)) {
			topEntity = entity;
		}
	});

	return topEntity;
};

//TODO Possibly move this all to the component files and register the buttons??
var componentButtons = {
	'cloaking-device': [
		{
			label: 'Cloak',
			handler: function() {
				_.each(ecs.getEntities('selected'), function(entity) {
					entity.addComponent('cloaking');
				});
			},
		}, {
			label: 'Decloak',
			handler: function() {
				_.each(ecs.getEntities('selected'), function(entity) {
					entity.addComponent('decloaking');
				});
			},
		}
	],
	'probe-blueprint': [{
		label: 'Probe',
		//TODO dry up duplicate handler code
		handler: function() {
			setActiveShipGenerator('probe-blueprint');
		},
	}],
	'fighter-blueprint': [{
		label: 'Fighter',
		handler: function() {
			setActiveShipGenerator('fighter-blueprint');
		},
	}],
	'battleship-blueprint': [{
		label: 'Battleship',
		handler: function() {
			setActiveShipGenerator('battleship-blueprint');
		},
	}],
	'colony-ship-blueprint': [{
		label: 'Colony Ship',
		handler: function() {
			setActiveShipGenerator('colony-ship-blueprint');
		},
	}],
	'colonizer': [{
		label: 'Colonize',
		handler: function() {
			interface.awaitTarget(true);
			//TODO Figure better solution for this temporary hack
			interface.targetHandler = this.targetHandler;
		},
		targetHandler: function(pointer) {
			var targetPosition = pointer.position;
			var selectedEntities = ecs.getEntities('selected');
			var targetEntity = getTopEntityAt(targetPosition);

			if(targetEntity && targetEntity.hasComponent('colonizable')) {
				_.each(selectedEntities, function(entity) {
					entity.components.waypoints = {
						queued: [{
							x: targetEntity.x,
							y: targetEntity.y,
							onComplete: function() {
								entity.addComponent('colonize', {
									target: targetEntity,
								});
							},
						}]
					};
				});
			}
		},
	}],
	'dockable': [{
		label: 'Dock',
		handler: function() {
			interface.awaitTarget(true);
			//TODO Figure better solution for this temporary hack
			interface.targetHandler = this.targetHandler;
		},
		targetHandler: function(pointer) {
			var targetPosition = pointer.position;
			var selectedEntities = ecs.getEntities('selected');
			var targetEntity = getTopEntityAt(targetPosition);

			if(targetEntity && targetEntity.hasComponent('ship-bay')) {
				_.each(selectedEntities, function(entity) {
					entity.components.waypoints = {
						queued: [{
							x: targetEntity.x,
							y: targetEntity.y,
							onComplete: function() {
								entity.addComponent('dock', {
									target: targetEntity,
								});
							},
						}]
					};
				});
			}
		},
	}],
	'hyperdrive': [{
		label: 'Charge Hyperdrive',
		handler: function() {
			_.each(ecs.getEntities('selected'), function(entity) {
				var chargeTween = game.add.tween(entity.components.hyperdrive).to({
					timeCharged: entity.components.hyperdrive.chargeTime
				}, entity.components.hyperdrive.chargeTime);

				chargeTween.onComplete.add(this.charged, entity);
				chargeTween.start();
			}, this);
		},
		charged: function() {
			this.addComponent('hyperdrive-ready');
			interface.update();
		},

	}],
	'hyperdrive-ready': [{
		label: 'Hyperspace Jump',
		handler: function() {
			interface.awaitTarget(true);
			//TODO Figure better solution for this temporary hack
			interface.targetHandler = this.targetHandler;
		},
		targetHandler: function(pointer) {
			var targetPosition = game.input.getLocalPosition(worldEntities, pointer);
			var selectedEntities = ecs.getEntities('selected');

			_.each(selectedEntities, function(entity) {
			entity
				.addComponent('group-movement', {
					hyperspace: true,
					centralPoint: targetPosition,
				});
			});
		},
	}],
	'movable': [{
		label: 'Move to',
		handler: function() {
			interface.awaitTarget(true);
			//TODO Figure better solution for this temporary hack
			interface.targetHandler = this.targetHandler;
		},
		targetHandler: function(pointer) {
			var targetPosition = game.input.getLocalPosition(worldEntities, pointer);
			var selectedEntities = ecs.getEntities('selected');

			_.each(selectedEntities, function(entity) {
				entity.components['group-movement'] = {
					centralPoint: targetPosition,
				};
			});
		},
	}],
	'ship-bay': [
		{
			label: 'Recall',
			handler: function() {
				console.log('dock nearest docable ships within certain range.');
			},
		}, {
			label: 'Scramble',
			handler: function() {
				interface.awaitTarget(true);
				//TODO Figure better solution for this temporary hack
				interface.targetHandler = this.targetHandler;
			},
			targetHandler: function(pointer) {
				var targetPosition = game.input.getLocalPosition(worldEntities, pointer);
				
				_.each(ecs.getEntities('selected'), function(entity) {
					entity.addComponent('scramble', {
						target: {
							x: targetPosition.x,
							y: targetPosition.y,
						}
					});
				});

			},
		},
	],
	'ship-generator': [{
		label: 'Set Rally Point',
		handler: function() {
			interface.awaitTarget(true);
			//TODO Figure better solution for this temporary hack
			interface.targetHandler = this.targetHandler;
		},
		targetHandler: function(pointer) {
			var targetPosition = game.input.getLocalPosition(worldEntities, pointer);
			var selectedEntities = ecs.getEntities('selected');

			_.each(selectedEntities, function(entity) {
				entity.components['ship-generator'].rallyPoint = targetPosition;
			});
		},
	}],
};

interface = {
	awaitTarget: ko.observable(false),
	options: ko.observableArray([]),
	selectedOption: ko.observable(),
	showMenu: ko.observable(false),
	targetHandler: null,

	update: function() {
		var entities = ecs.getEntities('selected');
		var commonComponents = _(entities).
			pluck('components').
			map(_.keys).
			reduce(function(commonComponents, components) {
				return _.intersection(commonComponents, components);
			});

		var buttons = _(commonComponents).
			map(function(component) {
				return componentButtons[component];
			}).
			compact().
			flatten().
			union().
			value();

		if(!buttons.length && this.showMenu()) {
			this.showMenu(false);
		} else if(buttons.length && !this.showMenu()) {
			this.showMenu(true);
		}

		this.options(buttons);
	},
};

module.exports =  interface;