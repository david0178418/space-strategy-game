define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		instanceManager = require('instance-manager');

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
		game.add.existing(this);
		
		this.x = this.y = -500;

		// TODO Remove debug
		window.dragSelection = this;
	}

	DragSelection.prototype = Object.create(Phaser.Graphics.prototype);
	_.extend(DragSelection.prototype, {
		constructor: DragSelection,
		update: function() {
			var i,
				entity,
				entitiesLength,
				dragX,
				dragY,
				localPoint;

			if(this.mouse.button === 0) {
				dragX = this.mousePointer.worldX;
				dragY = this.mousePointer.worldY;

				if(!this.startSelection) {
					this.startSelection = true;
					this.visible = true;
					this.position.set(dragX - 10, dragY - 10);
					
					// TODO: One pass at drawing upon selection start to
					// get correct bounds before the graphics have been rendered
					// DRY up at a later time.
					this.clear();
					this.lineStyle(3, 0xFFFF0B);
					this.beginFill(0xFFFF0B);
					this.drawRect(0, 0, dragX - this.position.x, dragY - this.position.y);
					this.endFill();
					return;
				} else if(!this.startDrag && (
						Math.abs(dragX - this.position.x) > 10 || Math.abs(dragY - this.position.y) > 10
					)
				) {
					this.startDrag = true;
				}

				this.clear();
				this.lineStyle(3, 0xFFFF0B);
				this.beginFill(0xFFFF0B);
				this.drawRect(0, 0, dragX - this.position.x, dragY - this.position.y);
				this.endFill();

				entitiesLength = this.worldEntities.length;
				
				this.entitySelected = false;

				for(i = 0; i < entitiesLength; i++) {
					entity = this.worldEntities.getAt(i);

					if(entity.isSelectable && entity.ownable && entity.isOwnedBy('player')) {
						if((this.startDrag || !this.entitySelected) && this.getBounds().intersects(entity.getBounds()) ) {
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
				movableSelectedCount = 0,
				selectedEntities = [];

			for(i = 0; i < this.worldEntities.length; i++) {
				entity = this.worldEntities.getAt(i);

				if(entity.isSelected) {
					selectedEntities.push(entity);

					if(entity.movable) {
						movableSelectedCount++;
						xTotal += entity.x;
						yTotal += entity.y;
					}
				}
			}

			avgX = xTotal / movableSelectedCount;
			avgY = yTotal / movableSelectedCount;

			for(i = 0; i < selectedEntities.length; i++) {
				entity = selectedEntities[i];
				xDiff = avgX - entity.x;
				yDiff = avgY - entity.y;
				entity.rightClickHandler(x - xDiff, y - yDiff, this.controls.shiftModifier.isDown);
			}
		},
	});

	window.DragSelection = DragSelection;
	return DragSelection;
});
