define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		instanceManager = require('instance-manager');

	function DragSelection(props) {
		var game = instanceManager.get('game');
		Phaser.Graphics.call(this, game, 0, 0);
		
		this.area = new Phaser.Rectangle(0, 0, 1, 1);
		this.worldEntities = game.world.children;
		this.endPoint = new Phaser.Point();
		this.mouse = game.input.mouse;
		this.alpha = 0.25;
		this.visible = false;
		this.startSelection = false;
		game.add.existing(this);
	}
	
	DragSelection.prototype = Object.create(Phaser.Graphics.prototype);
	_.extend(DragSelection.prototype, {
		constructor: DragSelection,
		update: function() {
			var x,
				entity,
				entitiesLength,
				dragX,
				dragY;
			
			if(this.mouse.button === 0) {
				dragX = this.game.input.mousePointer.worldX,
				dragY = this.game.input.mousePointer.worldY;
				
				if(!this.startSelection) {
					this.startSelection = true;
					this.visible = true;
					this.position.set(dragX - 10, dragY - 10);
					this.area.x = dragX - 10;
					this.area.y = dragY - 10;
				}
				this.clear();
				this.lineStyle(3, 0xFFFF0B);
				this.beginFill(0xFFFF0B);
				this.drawRect(0, 0, dragX - this.position.x, dragY - this.position.y);
				this.endFill();
				this.area.width = dragX - this.position.x;
				this.area.height = dragY - this.position.y;
				
				entitiesLength = this.worldEntities.length;
					
				for(x = 0; x < entitiesLength; x++) {
					entity = this.worldEntities[x];
					
					if(entity.isSelectable) {
						if(this.area.intersects(entity.getBounds())) {
							entity.select();
						} else if(entity.selected) {
							entity.deselect();
						}
					}
				}
			} else if(this.startSelection) {
				this.startSelection = false;
				this.visible = false;
				
			}
		}
	});
	
	window.DragSelection = DragSelection;
	return DragSelection;
});