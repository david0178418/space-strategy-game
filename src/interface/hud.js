var instanceManager = require('instance-manager');

function Hud() {
	this.game = instanceManager.get('game');
	this.viewModel = instanceManager.get('uiViewModel');
	window.hud = this;	//debug
}

Hud.prototype = {
};

module.exports = Hud;