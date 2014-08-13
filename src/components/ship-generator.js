define(function(require) {
	"use strict";
	var worldEntities;
	var Fighter = require('entities/ships/fighter');
	var instanceManager = require('instance-manager');
	
	return {
		activeGenerator: null,
		shipTypes: null,
		rallyPoint: null,
		
		initComponentShipGenerate: function() {
			worldEntities = instanceManager.get('worldEntities');
			this.rallyPoint = {
				x: this.x,
				y: this.y,
			};
			this.generators = [
				{
					type: Fighter,
					buildTime: 6000,
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