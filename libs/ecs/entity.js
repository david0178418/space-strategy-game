var _ = require('lodash');
var instanceManager = require('instance-manager');
var Phaser = require('phaser');

function Entity(x, y, graphic) {
	this.id = _.uniqueId('entity-');
	this._components = {};
	this._ecs = require('ecs/ecs');

	var game = instanceManager.get('game');
	
	Phaser.Sprite.call(this, game, x, y, graphic);
	this.anchor.setTo(0.5, 0.5);
	this.autoCull = true;
}

Entity.prototype = Object.create(Phaser.Sprite.prototype);
_.extend(Entity.prototype, {
	constructor: Entity,
	id: null,
	_components: null,
	addComponent: function(component, props) {
		this._components[component] = this._ecs.createComponent(component, props);

		return this;
	},
	currentComponents: function() {
		//TODO Cache this
		return _.keys(this._components);
	},
	getComponent: function(component) {
		return this._components[component];
	},
	hasComponent: function(component) {
		return _.contains(this.currentComponents(), component);
	},
	hasComponents: function(components) {
		_.all(components, this.hasComponent, this);
	},
});

module.exports = Entity;