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

	mouseHold: false,
	mouseClick: false,

	components: [
		'selectable',
	],

	init: function() {
		game.input.holdRate = 250;
		this.graphic = this.game.add.graphics(-500, -500);
		this.graphic.alpha = 0.25;
		this.graphic.visible = false;
		this.uiViewModel = instanceManager.get('uiViewModel');

		window.uiViewModel = this.uiViewModel;
	},

	run: function(entities) {
		var dragX;
		var dragY;
		var entity;
		var entitiesLength;
		var graphic;
		var i;
		var noMovableEntities;
		var selectableComponent;
		var selectedEntites;

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
				this.drawDragArea(dragX, dragY);
				return;
			} else if(!this.startDrag && (
					Math.abs(dragX - graphic.position.x) > 10 || Math.abs(dragY - graphic.position.y) > 10
				)
			) {
				this.startDrag = true;
			}

			this.drawDragArea(dragX, dragY);

			entitiesLength = entities.length;
			noMovableEntities = true;
			selectedEntites = [];

			for(i = 0; i < entitiesLength; i++) {
				entity = entities[i];
				selectableComponent = entity.components.selectable;

				if(entity.components.team.name === 'player') {
					if((this.startDrag || !selectableComponent.selected) && graphic.getBounds().intersects(entity.getBounds()) ) {
						selectableComponent.selected = true;
						selectedEntites.push(entity);

						if(noMovableEntities && entity.components.movable) {
							noMovableEntities = false;
						}
					} else if(selectableComponent.selected) {
						selectableComponent.selected = false;
					}
				}
			}

			if(selectedEntites.length && noMovableEntities && !this.uiViewModel.showProductionOptions()) {
				this.createShipProductionOptions(selectedEntites);
				this.uiViewModel.showProductionOptions(true);
			} else if(!noMovableEntities && this.uiViewModel.showProductionOptions()) {
				this.uiViewModel.showProductionOptions(false);
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

	//TODO This is all gross.  Rework is needed before moving on too far
	createShipProductionOptions: function(entities) {
		var productionOptions = [];
		var shipGeneratorComponent = entities[0].components['ship-generator'];

		this.uiViewModel.selectedOption(shipGeneratorComponent.activeGenerator);
		_.each(shipGeneratorComponent.options, function(generator, index) {
			productionOptions.push({
				index: index,
				label: generator.label,
				clickHandler: function() {
					shipGeneratorComponent.activeGenerator = index;

					this.uiViewModel.selectedOption(index);
				}.bind(this),
			});
		}, this);

		this.uiViewModel.options(productionOptions);
	},

	drawDragArea: function(dragX, dragY) {
		var graphic = this.graphic;
		graphic.clear();
		graphic.lineStyle(3, 0xFFFF0B);
		graphic.beginFill(0xFFFF0B);
		graphic.drawRect(0, 0, dragX - graphic.position.x, dragY - graphic.position.y);
		graphic.endFill();
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
			} else if(entity.components.movable && entity.components.team.name === 'player') {
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