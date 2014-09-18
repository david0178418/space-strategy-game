var _ = require('lodash');
var ecs = require('ecs/ecs');
var ko = require('knockout');

module.exports = {
	component: ko.observable(''),
	options: ko.observableArray([]),
	selectedOption: ko.observable(),
	showProductionOptions: ko.observable(false),

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
	}
};