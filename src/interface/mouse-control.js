var _ = require('lodash');
var Phaser = require('phaser');
var instanceManager = require('instance-manager');
var game = instanceManager.get('game');

module.exports = {
	checkForDoubleClick: false,
	controls: null,
	ecs: require('ecs/ecs'),
	endPoint: new Phaser.Point(),
	game: instanceManager.get('game'),
	graphic: null,
	mousePointer: null,
	registerRightClick: false,
	startSelection: false,
	worldEntities: null,

	init: function() {
		this.controls = instanceManager.get('controls');
		this.mousePointer = game.input.mousePointer;
		this.worldEntities = instanceManager.get('worldEntities');

		this.graphic = this.game.add.graphics(-500, -500);
		this.graphic.alpha = 0.25;
		this.graphic.visible = false;

		this.game.input.onUp.add(this.markRightClick.bind(this));
		this.game.input.onTap.add(this.differentiateClick.bind(this));
		this.game.input.onUp.add(this.dragEnd.bind(this));
		this.game.input.mouse.mouseMoveCallback = this.drag.bind(this);
	},

	update: function() {
		if(!this.checkForDoubleClick) {
			return;
		}

		if(this.mousePointer.msSinceLastClick > game.input.doubleTapRate) {
			this.checkForDoubleClick = false;
			this.leftSingleClick(this.mousePointer.positionUp.x, this.mousePointer.positionUp.y);
		}
	},

	differentiateClick: function(pointer, isDoubleClick) {
		if(pointer.button === Phaser.Mouse.RIGHT_BUTTON) {
			this.rightClick(pointer.x, pointer.y);
			return;
		}

		if(isDoubleClick) {
			this.checkForDoubleClick = false;
			this.leftDoubleClick(pointer.x, pointer.y);
		} else {
			this.checkForDoubleClick = true;
		}
	},

	drag: function(ev) {
		var dragX;
		var dragY;
		var graphic;
		var noMovableEntities;
		var selectedEntites;

		if(game.input.mousePointer.isUp  || ev.button !== Phaser.Mouse.LEFT_BUTTON) {
			this.graphic.visible = false;
			return;
		}

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
			this.drawDragArea(dragX, dragY);
			return;
		}

		this.drawDragArea(dragX, dragY);

		noMovableEntities = true;
		selectedEntites = [];

		_.each(this.ecs.getEntities('selectable'), function(entity) {
			var intersects;
			var isSelected = entity.components.selected;

			if(entity.components.team.name === 'player') {
				intersects = graphic.getBounds().intersects(entity.getBounds());

				if(!isSelected && intersects) {
					entity.addComponent('selected');
					selectedEntites.push(entity);
				} else if(isSelected && !intersects) {
					entity.removeComponent('selected');
				}
			}
		});

		graphic.visible = true;
	},

	dragEnd: function() {
		this.graphic.visible = false;
		this.startSelection = false;
	},

	drawDragArea: function(dragX, dragY) {
		var graphic = this.graphic;
		graphic.clear();
		graphic.lineStyle(3, 0xFFFF0B);
		graphic.beginFill(0xFFFF0B);
		graphic.drawRect(0, 0, dragX - graphic.position.x, dragY - graphic.position.y);
		graphic.endFill();
	},

	leftDoubleClick: function(x, y) {
		var entities = this.ecs.getEntities('selectable');
		var selectedEntity = this.getTopEntityAt(entities, x, y);
		var selectedEntityTeam;
		var selectedEntityTeamComponent;

		if(!selectedEntity) {
			return;
		}

		selectedEntityTeamComponent = selectedEntity.components.team;
		selectedEntityTeam = selectedEntityTeamComponent && selectedEntityTeamComponent.name;

		_.each(entities, function(entity) {
			var entityTeamComponent = entity.components.team;
			var team = entityTeamComponent && entityTeamComponent.name;

			if(
				entity.entityType === selectedEntity.entityType &&
				selectedEntityTeam === team &&
				entity.inCamera
			) { 
				entity.addComponent('selected');
			} else {
				entity.removeComponent('selected');
			}
		});
	},

	leftSingleClick: function(x, y) {
		var entities = this.ecs.getEntities('selectable');
		var selectedEntity = this.getTopEntityAt(entities, x, y);

		_.each(entities, function(entity) {
			entity.toggleComponent('selected', entity === selectedEntity);
		});
	},

	markRightClick: function(ev) {
		if(ev.button !== Phaser.Mouse.RIGHT_BUTTON) {
			return;
		}

		var marker = this.game.add.sprite(this.game.input.mousePointer.worldX, this.game.input.mousePointer.worldY, 'waypointMarker');
		var markerAnimationTime = 250;
		var markerTween;

		marker.anchor.setTo(0.5, 0.5);

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

	rightClick: function(x, y) {
		var entities = this.ecs.getEntities('selectable');
		
		_.each(entities, function(entity) {
			if(entity.is('selected')) {
				entity.addComponent('issue-order', {
					x: x,
					y: y,
				});
			}
		});
	},

	getTopEntityAt: function(entities, x, y) {
		var topEntity;

		_.each(entities, function(entity) {
			if(
				entity.components.team.name === 'player' &&
				(!topEntity || topEntity.z < entity.z) &&
				entity.getBounds().contains(x, y)
			) {
				topEntity = entity;
			}
		});

		return topEntity;
	},
};
