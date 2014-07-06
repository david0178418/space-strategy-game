define(function(require) {
	"use strict";
	var worldEntities,
		Ship = require('entities/ship'),
		instanceManager = require('instance-manager');
	
	return {
		activeGenerator: null,
		shipTypes: null,
		waypoint: null,
		
		initComponentShipGenerate: function() {
			worldEntities = instanceManager.get('worldEntities');
			this.waypoint = {
				x: this.x,
				y: this.y,
			};
			this.generators = [
				{
					type: Ship,
					buildTime: 2000,
					currentUnitBuildTime: 0,
				}
			];
			
			this.activeGenerator = this.generators[0];
		},
		
		updateComponentShipGenerator: function() {
			var newShip;
			this.activeGenerator.currentUnitBuildTime += this.game.time.elapsed;
			
			if(this.activeGenerator.currentUnitBuildTime >= this.activeGenerator.buildTime) {
				this.activeGenerator.currentUnitBuildTime = 0;
				newShip = new this.activeGenerator.type({
					x: this.x,
					y: this.y,
					ownedBy: 'player',
				});
				
				worldEntities.addChild(newShip);
				newShip.moveTo(this.x + 200, this.y + 75);
			}
		},
	};
});