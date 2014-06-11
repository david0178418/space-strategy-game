define(function(require) {
	"use strict";
	var Phaser = require('phaser');
	
	return {
		_selectionGraphic: null,
		_radiusBuffer: 20,
		isSelectable: true,
		isSelected: false,

		initSelectable: function() {
			this._selectionGraphic = new Phaser.Graphics(this.game, 0, 0);
			this._selectionGraphic
				.lineStyle(3, 0xff3333, 0.6)
				.moveTo(0, 0)
				.drawCircle(0, 0, (this.width/2) + this._radiusBuffer)
				.endFill();

			this._selectionGraphic.visible = false;

			//TODO Change to a child once real sprites are used
			// due to scaling wierdness
			this._selectionGraphic.x = this.x;
			this._selectionGraphic.y = this.y;
			this.game.add.existing(this._selectionGraphic);
		},

		updateSelectionGraphic: function() {
			if(!this._selectionGraphic.visible) {
				return;
			}
			
			//TODO Remove manual position update once made a child
			this._selectionGraphic.x = this.x;
			this._selectionGraphic.y = this.y;
		},

		toggleSelection: function() {
			if(this.isSelected) {
				this.unselect();
			} else {
				this.select();
			}
		},

		select: function(target) {
			this.isSelected = true;
			
			//TODO Remove manual position update once made a child
			this._selectionGraphic.x = this.x;
			this._selectionGraphic.y = this.y;
			
			this._selectionGraphic.visible = true;
		},

		deselect: function(target) {
			this.isSelected = false;
			this._selectionGraphic.visible = false;
		},
	};
});