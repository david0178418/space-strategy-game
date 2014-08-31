var _ = require('lodash');
var instanceManager = require('instance-manager');
var Phaser = require('phaser');

function Entity(x, y, graphic) {
	this.id = _.uniqueId('entity-');
	this.components = {};
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
	components: null,
	addComponent: function(component, props) {
		this.components[component] = this._ecs.createComponent(component, props);

		return this;
	},
	currentComponents: function() {
		//TODO Cache this
		return _.keys(this.components);
	},
	getComponent: function(component) {
		return this.components[component];
	},
	hasComponent: function(component) {
		return _.contains(this.currentComponents(), component);
	},
	hasComponents: function(components) {
		return _.all(components, this.hasComponent, this);
	},
	removeComponent: function(component) {
		delete this.components[component];
	},
});

module.exports = Entity;