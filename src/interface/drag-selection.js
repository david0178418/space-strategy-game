

function DragSelection() {
	var game = instanceManager.get('game');
	Phaser.Graphics.call(this, game, 0, 0);

	this.worldEntities = instanceManager.get('worldEntities');
	this.endPoint = new Phaser.Point();
	this.mouse = game.input.mouse;
	this.alpha = 0.25;
	this.visible = false;
	this.entitySelected = false;
	this.startDrag = false;
	this.startSelection = false;
	this.mousePointer = game.input.mousePointer;
	this.controls = instanceManager.get('controls');
	this.selectedEntities = null;
	game.add.existing(this);
	
	this.x = this.y = -500;

	// TODO Remove debug
	window.dragSelection = this;
}

DragSelection.prototype = Object.create(Phaser.Graphics.prototype);
_.extend(DragSelection.prototype, {
	constructor: DragSelection,
	update: 
});

//TOD Remove debug
window.DragSelection = DragSelection;
module.exports = DragSelection;