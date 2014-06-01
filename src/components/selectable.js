define(function(require) {
	"use strict";
	var Phaser = require('phaser');
	return {
			_selectionGraphic: null,
			_radiusBuffer: 0,
			isSelectable: true,
			selected: false,
		
			initSelectable: function() {
				this._selectionGraphic = new Phaser.Graphics(this.game, 0, 0);
				this._selectionGraphic
					.lineStyle(2, 0xff3333, 0.6)
					.moveTo(0, 0)
					.drawCircle(0, 0, (this.width/2) + this._radiusBuffer)
					.endFill();
				
				this._selectionGraphic.visible = false;
				this.addChild(this._selectionGraphic);
			},
		
			toggleSelection: function() {
				if(this.seleted) {
					this.unselect();
				} else {
					this.select();
				}
			},
		
			select: function(target) {
				this.selected = true;
				this._selectionGraphic.visible = true;
			},
		
			deselect: function(target) {
				this.selected = false;
				this._selectionGraphic.visible = false;
			},
		};
});