var _ = require('lodash');
var instanceManager = require('instance-manager');
var Phaser = require('phaser');

function hasComponent(component) {
	return _.contains(this.currentComponents(), component);
}

function Entity(x, y, graphic) {

	this._ecs = require('ecs/ecs');
	this.components = {};
	this.id = _.uniqueId('entity-');
	this.entityType = graphic;

	var game = instanceManager.get('game');

	Phaser.Sprite.call(this, game, x, y, graphic);
	this.anchor.setTo(0.5, 0.5);
	this.autoCull = true;
}

Entity.prototype = Object.create(Phaser.Sprite.prototype);
_.extend(Entity.prototype, {
	_ecs: null,

	components: null,
	constructor: Entity,
	id: null,
	entityType: '',

	addComponent: function(component, props) {
		if(this.components[component] && !props) {
			return this;
		}

		this.components[component] = this._ecs.createComponent(component, props);

		return this;
	},
	currentComponents: function() {
		//TODO Cache this
		return _.keys(this.components);
	},
	is: hasComponent,
	getComponent: function(component) {
		return this.components[component];
	},
	hasComponent: hasComponent,
	hasComponents: function(components) {
		components = _.isArray(components) ? components: [components];
		return _.all(components, this.hasComponent, this);
	},
	removeComponent: function(component) {
		delete this.components[component];
	},
	toggleComponent: function(component, addComponent, props) {
		/*jshint -W030 */
		addComponent = _.isUndefined(addComponent) ? !this.components[component] : addComponent;

		addComponent ? this.addComponent(component, props): this.removeComponent(component);
	}
});

module.exports = Entity;
