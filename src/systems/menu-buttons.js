var _ = require('lodash');
var instanceManager = require('instance-manager');

require('ecs/ecs').registerSystem('menu', {

	uiViewModel: instanceManager.get('uiViewModel'),

	components: [
		'selected',
	],

	run: function(entities) {
		//TODO Clean up this mess for generating menu options
		var commonOptions;

		_.find(entities, function(entity) {
			var entityOptions = this.getMenuOptions(entity);

			if(!commonOptions) {
				commonOptions = entityOptions;
			} else {
				commonOptions = _.filter(commonOptions, function(commonOption) {
						return _.find(entityOptions, function(entityOption) {
							return entityOption.label === commonOption.label;
						});
					});
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