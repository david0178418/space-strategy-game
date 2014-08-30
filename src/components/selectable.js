require('ecs/ecs').registerComponent('selectable', {
	selectionGraphic: null,
	radiusBuffer: 20,
	isSelectable: true,
	isSelected: false,
});