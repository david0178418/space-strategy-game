var _ = require('lodash');
var instanceManager = require('instance-manager');

require('ecs/ecs').registerSystem('menu', {

	uiViewModel: instanceManager.get('uiViewModel'),

	components: [
		'selected',
	],

	run: function(entities) {
		//TODO Clean up this mess for generating menu options
		var commonOptions = this.getMenuOptions(entities);

		_.find(entities, function(entity) {
			var entityOptions = this.getMenuOptions(entity);

			if(!commonOptions) {
				commonOptions = entityOptions;
			} else {
				commonOptions = _.union(commonOptions, entityOptions);
			}

			return !commonOptions.length;
		}, this);

		if(!commonOptions.length) {
			if(this.uiViewModel.showProductionOptions()) {
				this.uiViewModel.showProductionOptions(false);
			}
			return;
		}

		this.uiViewModel.options(commonOptions);


		if(!this.uiViewModel.showProductionOptions()) {
			this.uiViewModel.showProductionOptions(true);
		}
	},

	getMenuOptions: function(entity) {
		return _(entity.components)
			.pluck('options')
			.flatten()
			.compact()
			.value();
	},
});