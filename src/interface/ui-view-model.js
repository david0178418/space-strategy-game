var _ = require('lodash');
var ecs = require('ecs/ecs');
var ko = require('knockout');
var setActiveShipGenerator = function(generator) {
	_.each(ecs.getEntities(['selected']), function(entity) {
		entity.components['ship-generator'].activeGenerator = generator;
	})
}

//TODO Possibly move this all to the component files and register the buttons??
var componentButtons = {
	'cloaking-device': [
		{
			label: 'Cloak',
			handler: function() {
				_.each(ecs.getEntities(['selected']), function(entity) {
					entity.addComponent('cloaking');
				});
			},
		}, {
			label: 'Decloak',
			handler: function() {
				_.each(ecs.getEntities(['selected']), function(entity) {
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
	}]
};

module.exports = {
	component: ko.observable(''),
	options: ko.observableArray([]),
	selectedOption: ko.observable(),
	showMenu: ko.observable(false),

	update: function() {
		var entities = ecs.getEntities(['selected']);
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

	cloakHandler: function() {
		var entities = ecs.getEntities([
			'selected',
			'cloaking-device',
		]);

		_.invoke(entities, 'addComponent', 'cloaking');
	},

	decloakHandler: function() {
		var entities = ecs.getEntities([
			'selected',
			'cloaking-device',
		]);

		_.invoke(entities, 'addComponent', 'decloaking');
	},

	// TODO Gross and brittle way to handle ship production
	changeProductionHandler: function(clickedOption) {
		var entities = ecs.getEntities([
			'selected',
			'ship-generator',
		]);

		_.each(entities, function(entity) {
			var generatorComponent = entity.getComponent('ship-generator');
			var generatorIndex  = _(generatorComponent.options).
				pluck('type').
				indexOf(clickedOption.type);

			generatorComponent.activeGenerator = generatorIndex;
		});
	},
};
