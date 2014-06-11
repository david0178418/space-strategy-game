define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		instanceManager = require('instance-manager');

	function DragSelection(props) {
		var game = instanceManager.get('game');
		Phaser.Graphics.call(this, game, 0, 0);
		
		this.area = new Phaser.Rectangle(0, 0, 1, 1);
		this.selectableEntities = game.world.children;
		this.endPoint = new Phaser.Point();
		this.mouse = game.input.mouse;
		this.alpha = 0.25;
		this.visible = false;
		this.startSelection = false;
		this.mousePointer = game.input.mousePointer;
		game.add.existing(this);
	}
	
	DragSelection.prototype = Object.create(Phaser.Graphics.prototype);
	_.extend(DragSelection.prototype, {
		constructor: DragSelection,
		update: function() {
			var i,
				entity,
				entitiesLength,
				dragX,
				dragY;
			
			if(this.mouse.button === 0) {
				dragX = this.mousePointer.worldX;
				dragY = this.mousePointer.worldY;
				
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
				
				entitiesLength = this.selectableEntities.length;
					
				for(i = 0; i < entitiesLength; i++) {
					entity = this.selectableEntities[i];
					
					if(entity.isSelectable) {
						if(this.area.intersects(entity.getBounds())) {
							entity.select();
						} else if(entity.isSelected) {
							entity.deselect();
						}
					}
				}
			} else if(this.mouse.button === 2) {
				this.registerRightClick = true;
			} else if(this.registerRightClick) {
				this.registerRightClick = false;
				console.log(this.mousePointer.worldX, this.mousePointer.worldY);
				this.sendRightClick(this.mousePointer.worldX, this.mousePointer.worldY);
			} else if(this.startSelection) {
				this.startSelection = false;
				this.visible = false;
				
			}
		},
		
		sendRightClick: function(x, y) {
			var i,
				entity,
				avgX,
				avgY,
				xDiff,
				yDiff,
				xTotal = 0,
				yTotal = 0,
				selectedEntities = [];
			
			for(i = 0; i < this.selectableEntities.length; i++) {
				entity = this.selectableEntities[i];
				
				if(entity.isSelected) {
					selectedEntities.push(entity);

					xTotal += entity.x;
					yTotal += entity.y;
				}
			}
			
			avgX = xTotal / selectedEntities.length;
			avgY = yTotal / selectedEntities.length;
			
			for(i = 0; i < selectedEntities.length; i++) {
				entity = selectedEntities[i];
				xDiff = avgX - entity.x;
				yDiff = avgY - entity.y;
				entity.rightClickHandler(x - xDiff, y - yDiff);
			}
		},
	});
	
	window.DragSelection = DragSelection;
	return DragSelection;
});