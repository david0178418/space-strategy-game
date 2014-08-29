//TODO Need better place to organize since not really an entity.  Maybe "interface" folder?
var instanceManager = require('instance-manager');

function Hud() {
	this.game = instanceManager.get('game');
	this.meteorController = instanceManager.get('meteorController');

	this.currentScore = this.meteorController.killCount;

	this.scoreMsg = this.game.add.text(20, 20, 'Score: '+this.meteorController.killCount, {
		font: '30px Arial',
		fill: '#ff0044',
		align: 'left'
	});

	this.scoreMsg.fixedToCamera = true;
	this.healthMsg.fixedToCamera = true;
	this.powerMsg.fixedToCamera = true;

	window.hud = this;	//debug
}

Hud.prototype = {
	update: function() {
		if(this.currentScore !== this.meteorController.killCount) {
			this.scoreMsg.text = 'Score: '+this.meteorController.killCount;
			this.currentScore = this.meteorController.killCount;
		}
	}
};

Hud.preload = function(game) {

};

module.exports = Hud;