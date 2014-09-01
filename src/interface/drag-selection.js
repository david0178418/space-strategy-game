var _ = require('lodash');
var Phaser = require('phaser');
var instanceManager = require('instance-manager');
var game = instanceManager.get('game');

module.exports = {
	controls: instanceManager.get('controls'),
	endPoint: new Phaser.Point(),
	entitySelected: false,
	game: game,
	graphic: null,
	mouse: game.input.mouse,
	mousePointer: game.input.mousePointer,
	registerRightClick: false,
	selectedEntities: null,
	startDrag: false,
	startSelection: false,
	
	worldEntities: instanceManager.get('worldEntities'),

	init: function() {
		this.graphic = this.game.add.graphics(-500, -500);
		this.graphic.alpha = 0.25;
		this.graphic.visible = false;
	},

	update: function() {
		var i;
		var dragX;
		var dragY;
		var entity;
		var entitiesLength;
		var graphic;
		var localPoint;

		if(this.mouse.button === 0) {
			graphic = this.graphic;
			dragX = this.mousePointer.worldX;
			dragY = this.mousePointer.worldY;

			if(!this.startSelection) {
				this.startSelection = true;
				graphic.visible = true;
				graphic.position.set(dragX - 10, dragY - 10);
				
				// TODO: One pass at drawing upon selection start to
				// get correct bounds before the graphics have been rendered
				// DRY up at a later time.
				graphic.clear();
				graphic.lineStyle(3, 0xFFFF0B);
				graphic.beginFill(0xFFFF0B);
				graphic.drawRect(0, 0, dragX - graphic.position.x, dragY - graphic.position.y);
				graphic.endFill();
				return;
			} else if(!this.startDrag && (
					Math.abs(dragX - graphic.position.x) > 10 || Math.abs(dragY - graphic.position.y) > 10
				)
			) {
				this.startDrag = true;
			}

			graphic.clear();
			graphic.lineStyle(3, 0xFFFF0B);
			graphic.beginFill(0xFFFF0B);
			graphic.drawRect(0, 0, dragX - graphic.position.x, dragY - graphic.position.y);
			graphic.endFill();

			entitiesLength = this.worldEntities.length;
			
			this.entitySelected = false;

			for(i = 0; i < entitiesLength; i++) {
				entity = this.worldEntities.getAt(i);

				if(entity.isSelectable && entity.ownable && entity.isOwnedBy('player')) {
					if((this.startDrag || !this.entitySelected) && graphic.getBounds().intersects(entity.getBounds()) ) {
						this.entitySelected = true;
						entity.select();
					} else if(entity.isSelected) {
						entity.deselect();
					}
				}
			}
		} else if(this.mouse.button === 2) {
			this.registerRightClick = true;
		} else if(this.registerRightClick) {
			localPoint = this.game.input.getLocalPosition(this.worldEntities, this.game.input.mousePointer);
			this.registerRightClick = false;
			
			this.sendRightClick(localPoint.x, localPoint.y);
		} else if(this.startSelection) {
			this.startSelection = false;
			this.startDrag = false;
			graphic.visible = false;

		}
	},

	sendRightClick: function(x, y) {
		var avgX;
		var avgY;
		var entity;
		var maxX = this.game.world.height * 10;
		var maxY = this.game.world.width * 10;
		var minX = -1;
		var minY = -1;
		var movableSelectedCount = 0;
		var rowCount;
		var selectedEntities = [];
		var slotWidth = 80;
		var xDiff;
		var xTotal = 0;
		var yDiff;
		var yTotal = 0;

		for(i = 0; i < this.worldEntities.length; i++) {
			entity = this.worldEntities.getAt(i);

			if(entity.isSelected) {
				selectedEntities.push(entity);

				if(entity.movable) {
					movableSelectedCount++;
					xTotal += entity.x;
					yTotal += entity.y;
					
					if(entity.x > maxX) {
						maxX = entity.x;
					} else if(entity.x < minX) {
						minX = entity.x;
					}
					
					if(entity.y > maxY) {
						maxY = entity.y;
					} else if(entity.y < minY) {
						minY = entity.y;
					}
				}
			}
		}
		
		rowCount = Math.sqrt(movableSelectedCount) | 0;

		avgX = xTotal / movableSelectedCount;
		avgY = yTotal / movableSelectedCount;
		
		for(i = 0; i < selectedEntities.length; i++) {
			entity = selectedEntities[i];
			
			xDiff = slotWidth * (i % rowCount);
			yDiff = slotWidth * ((i / rowCount)| 0);
			entity.rightClickHandler(x + xDiff, y + yDiff, this.controls.shiftModifier.isDown);
		}
	},
};