var _ = require('lodash');
var Phaser = require('phaser');
var instanceManager = require('instance-manager');

function Beam() {
	var game = instanceManager.get('game');
	Phaser.Graphics.call(this, game, 0, 0);
	
	this.beginFill(0xEE2222);
	this.lineStyle(5, 0xffd900, 1);
	game.add.existing(this);
	this.moveTo(0, 0);
	this.lineTo(-1, 0);
	this.endFill();
	this.scale.x = 0;
	this.pivot.x = 0.5;
	
	this.sound = game.add.sound('beam');
}

Beam.TRANSITION_TIME = 100;

Beam.prototype = Object.create(Phaser.Graphics.prototype);
_.extend(Beam.prototype, {
	constructor: Beam,
	target: null,
	alive: false,
	kill: function() {
		this.alive = false;
		this.visible = false;
	},
	revive: function() {
		this.alive = true;
		this.visible = true;
	},
	fire: function(x, y, targetX, targetY) {
		var stretchDistance,
			game = this.game,
			moveToTarget = game.add.tween(this),
			stretch = game.add.tween(this.scale),
			dissipate = game.add.tween(this.scale);
		
		this.x = x;
		this.y = y;
		stretchDistance = this.position.distance({ x:targetX, y: targetY });
		
		stretch.to({
				x: stretchDistance
			}, Beam.TRANSITION_TIME)
			.to({
				x: 0
			}, Beam.TRANSITION_TIME);
		
		moveToTarget.to({
			x: targetX,
			y: targetY,
		}, Beam.TRANSITION_TIME);
		
		moveToTarget.onComplete.add(dissipate.start, dissipate);
		
		this.revive();
		this.rotation = this.game
			.physics
			.arcade
			.angleBetween(this, {
				x: targetX,
				y: targetY,
			});
		
		stretch.start();
		moveToTarget.start();
		
		this.sound.play();
	},
});

Beam.group = null;

Beam.preload = function(game) {
	game.load.audio('beam', '/assets/audio/laser1.ogg');
};

Beam.create = function() {
	var beam,
		beams = instanceManager.get('beams');
	
	beam = beams.getFirstDead();
	
	if(!beam) {
		beam = new Beam();
		beams.add(beam);
	}
	
	return beam;
};

module.exports = Beam;