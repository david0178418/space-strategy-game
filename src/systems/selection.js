var Phaser = require('phaser');

require('ecs/ecs').registerSystem('selection', {
	components: [
		'selectable',
	],

	init: function() {
		var instanceManager = require('instance-manager');
		this.game = instanceManager.get('game');
		this.worldEntities = instanceManager.get('worldEntities');
	},

	runOne: function(entity) {
		var selectableComponent = entity.components.selectable;

		if(entity.is('selected')) {
			if(!selectableComponent.graphic) {
				selectableComponent.graphic = new Phaser.Sprite(this.game, 0, 0, 'selection');
				selectableComponent.graphic.anchor.setTo(0.5, 0.5);
				entity.addChild(selectableComponent.graphic);
			} else if(!selectableComponent.graphic.visible) {
				selectableComponent.graphic.visible = true;
			}
		} else {
			if(selectableComponent.graphic && selectableComponent.graphic.visible) {
				selectableComponent.graphic.visible = false;
			}
		}
	}
});