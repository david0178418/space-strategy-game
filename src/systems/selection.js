

module.exports =  {
	_selectionGraphic: null,
	_radiusBuffer: 20,
	isSelectable: true,
	isSelected: false,

	initComponentSelectable: function() {
		this._selectionGraphic = new Phaser.Sprite(this.game, 0, 0, 'selection');
		
		this._selectionGraphic.anchor.setTo(0.5, 0.5);
		

		this._selectionGraphic.visible = false;
		
		//TODO Change to a child once real sprites are used
		// due to scaling wierdness
		this.addChild(this._selectionGraphic);
	},

	toggleSelection: function() {
		if(this.isSelected) {
			this.unselect();
		} else {
			this.select();
		}
	},

	select: function() {
		this.isSelected = true;
		this._selectionGraphic.visible = true;
	},

	deselect: function() {
		this.isSelected = false;
		this._selectionGraphic.visible = false;
	},
	
	rightClickHandler: function() {
	},
};