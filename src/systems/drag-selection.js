var _ = require('lodash');
var Phaser = require('phaser');
var instanceManager = require('instance-manager');
var game = instanceManager.get('game');

require('ecs/ecs').registerSystem('drag-selection', {
	controls: instanceManager.get('controls'),
	endPoint: new Phaser.Point(),
	game: game,
	graphic: null,
	mouse: game.input.mouse,
	mousePointer: game.input.mousePointer,
	registerRightClick: false,
	startDrag: false,
	startSelection: false,
	worldEntities: instanceManager.get('worldEntities'),

	components: [
		'selectable',
	],

	init: function() {
		this.graphic = this.game.add.graphics(-500, -500);
		this.graphic.alpha = 0.25;
		this.graphic.visible = false;
	},

	run: function(entities) {
		var i;
		var dragX;
		var dragY;
		var entity;
		var entitiesLength;
		var graphic;
		var selectableComponent;

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

			entitiesLength = entities.length;

			for(i = 0; i < entitiesLength; i++) {
				entity = entities[i];
				selectableComponent = entity.components.selectable;

				if(entity.components.ownable.ownedBy === 'player') {
					if((this.startDrag || !selectableComponent.selected) && graphic.getBounds().intersects(entity.getBounds()) ) {
						selectableComponent.selected = true;
					} else if(selectableComponent.selected) {
						selectableComponent.selected = false;
					}
				}
			}
		} else if(this.mouse.button === 2) {
			this.registerRightClick = true;
		} else if(this.registerRightClick) {
			this.processSelectedEntitiesRightClick(_.filter(entities, function(entity) {
				return entity.getComponent('selectable').selected;
			}));

		} else if(this.startSelection) {
			this.startSelection = false;
			this.startDrag = false;
			this.graphic.visible = false;

		}
	},

	markClickLocation: function(point) {
		var marker = new Phaser.Sprite(this.game, point.x, point.y, 'waypointMarker');
		var markerAnimationTime = 250;
		var markerTween;

		marker.anchor.setTo(0.5, 0.5);
		this.worldEntities.add(marker);

		markerTween = this.game.add.tween(marker.scale).to({
			x: 4,
			y: 4,
		}, markerAnimationTime);

		markerTween.onComplete.add(function() {
			marker.destroy();
		});

		this.game.add.tween(marker).to({
			alpha: 0,
		}, markerAnimationTime).start();
		markerTween.start();
	},

	processSelectedEntitiesRightClick: function(entities) {
		var entity;
		var i;
		var localPoint;
		var noMovable = !_.find(entities, function(entity) {
			return entity.hasComponent('movable');
		});

		localPoint = this.game.input.getLocalPosition(this.worldEntities, this.game.input.mousePointer);

		for(i = 0; i < entities.length; i++) {
			entity = entities[i];

			if(noMovable && entity.hasComponent('ship-generator')) {
				entity.getComponent('ship-generator').rallyPoint = localPoint;
			} else if(entity.components.movable && entity.components.ownable.ownedBy === 'player') {
				entity.components['group-movement'] = {
					override: this.controls.shiftModifier.isDown,
					centralPoint: localPoint,
				};
			}
		}

		this.registerRightClick = false;
		this.markClickLocation(localPoint);
	},
});