var _ = require('lodash');
var Phaser = require('phaser');

require('ecs/ecs').registerSystem('selection', {

	SELECTION_PADDING: 30,

	components: [
		'selectable',
	],

	init: function() {
		var instanceManager = require('instance-manager');
		this.game = instanceManager.get('game');
		this.worldEntities = instanceManager.get('worldEntities');
		this.uiViewModel = instanceManager.get('uiViewModel');
		this.selectionChanged = false;
	},

	run: function(entities) {
		_.each(entities, this.checkSelection, this);

		if(this.selectionChanged) {
			this.uiViewModel.update();
			this.selectionChanged = false;
		}
	},

	checkSelection: function(entity) {
		var selectableComponent = entity.components.selectable;
		var graphic;

		if(entity.is('selected')) {
			if(!selectableComponent.graphic) {
				graphic = new Phaser.Sprite(this.game, 0, 0, 'selection');
				graphic.anchor.setTo(0.5, 0.5);
				//Set the height and width to the greater of the two plus padding
				graphic.width = graphic.height =
					(entity.width > entity.height ? entity.width : entity.height)
					+ this.SELECTION_PADDING;
				this.worldEntities.addChild(graphic);
				selectableComponent.graphic = graphic;
				this.selectionChanged = true;
			} else if(!selectableComponent.graphic.visible) {
				selectableComponent.graphic.visible = true;
				this.selectionChanged = true;
			}

			selectableComponent.graphic.position.x = entity.position.x;
			selectableComponent.graphic.position.y = entity.position.y;
		} else if(selectableComponent.graphic && selectableComponent.graphic.visible) {
			this.selectionChanged = true;
			selectableComponent.graphic.visible = false;
		}
	}
});
