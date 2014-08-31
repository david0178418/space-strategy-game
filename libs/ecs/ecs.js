var _ = require('lodash');
var EntityBase = require('./entity');

module.exports = {
	_entities: [],
	_initSystems: {},
	_runSystems: {},
	_components: {},
	createEntity: function(x, y, grraphic) {
		var entity = new EntityBase(x, y, grraphic);
		this._entities.push(entity);
		return entity;
	},

	// @param {string} name - component name.  If component with matching name doesn't
	//		exist, a new one will be created using the provided properties as defaults
	// @param {object} [props={}] - component instant overrides.
	// @return {object}
	createComponent: function(name, props) {
		var component = this._components[name];
		props = props || {};
		if(!component) {
			this.registerComponent(name, props);
			return props;
		}

		return _.merge({}, props, component);
	},

	destroyEntity: function(entity) {
		var entityId = _.isObject(entity) ? entity.get('id') : entityId;
		delete this._entities[entityId];
		entity.destroy();
		return this;
	},

	getEntities: function(components) {
		return _.select(this._entities, function(entity) {
			return entity.hasComponents(components);
		});
	},

	// @param {string} name
	// @param {object} [defaultData={}] - provide an optional baseline for a component
	registerComponent: function(name, defaultData) {
		this._components[name] = _.cloneDeep(defaultData);
	},

	// @param {string} name
	// @param {object} system
	// @param {array} system.components - listing of components required for system operation
	// @param {function} system.run - system tick logic.  Receives array of all matching entities.
	// @param {function} system.init - system initialization.
	registerSystem: function(name, system) {
		if(system.init) {
			this._initSystems[name] = system;
		}

		if(system.run || system.runOne) {
			this._runSystems[name] = system;
		}
	},

	runSystemInits: function() {
		_.each(this._initSystems, function(system) {
			system.init();
		});
	},

	runSystems: function() {
		/*jshint expr:true */
		_.each(this._runSystems, function(system) {
			if(system.components) {
				var entities = this.getEntities(system.components);

				if(entities.length) {
					system.run && system.run(entities);
					system.runOne && _.map(entities, system.runOne, system);
				}
			} else {
				system.run();
			}
			
		}, this);
	}
};