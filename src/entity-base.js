var _ = require('lodash'),
	Phaser = require('phaser'),
	instanceManager = require('instance-manager');

function Entity(props) {
	var key,
		game = instanceManager.get('game');
	Phaser.Sprite.call(this, game, props.x, props.y, props.graphic);
	this.anchor.setTo(0.5, 0.5);
	this.autoCull = true;
	this._componentUpdates = [];
	
	// Run any initilizations that may be attached and
	// register any component update logic. Prefix with "initComponent"
	// and "updateComponent"
	for(key in this) {
		if(key.indexOf('initComponent') === 0) {
			this[key](props);
		} else if(key.indexOf('updateComponent') === 0) {
			this._componentUpdates.push(key);
		}
	}
	
	this.update = this.runComponentUpdates.bind(this);
}

Entity.prototype = Object.create(Phaser.Sprite.prototype);
_.extend(
	Entity.prototype,
	{
		constructor: Entity,
		update: null,
		
		runComponentUpdates: function() {
			for(var i = 0; i < this._componentUpdates.length; i++) {
				this[this._componentUpdates[i]]();
			}
		},
	}
);

module.exports = Entity;