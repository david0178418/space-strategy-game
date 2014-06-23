define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		intanceManager = require('instance-manager');

	return {
		_paths: null,
		_lineThickness: 3,
		moving: false,
		movable: true,
		
		moveTo: function(x, y, queueMovement) {
			var lastPath,
				startingPoint = this.position,
				endPoint = {
					x: x,
					y: y,
				},
				time = this.game.physics.arcade.distanceToXY(this, x, y) * 1000 / this.speed,
				pathGraphic = this.game.add.graphics(0, 0, intanceManager.get('worldEntities')),
				rotationTween = this.game.add.tween(this),
				moveTween = this.game.add.tween(this.position).
					to({
						x:x,
						y:y,
					}, time);
			
			pathGraphic.alpha = 0.5;
			this._paths = this._paths || [];
			
			if(!queueMovement) {
				_.each(this._paths, function(path) {
					this._killPath(path);
				}, this);
				
				this._paths = [];
			} else if(this._paths.length) {
				lastPath = _.last(this._paths);
				startingPoint = lastPath.end;
			}
			
			this._paths.push({
				start: startingPoint,
				end: endPoint,
				graphic: pathGraphic,
				move: moveTween,
				rotation: rotationTween,
			});
			
			rotationTween.to({
				rotation: Phaser.Point.angle(endPoint, startingPoint),
			}, 500);
			
			pathGraphic.lineStyle(this._lineThickness, 0x33ff33, 0.6);
			pathGraphic.position.x = 0;
			pathGraphic.position.y = 0;
			pathGraphic.moveTo(startingPoint.x, startingPoint.y);
			pathGraphic.lineTo(x, y);
			pathGraphic.drawCircle(x, y, 5);
			pathGraphic.endFill();
			
			moveTween
				.onUpdateCallback(function() {
					pathGraphic.clear();
					pathGraphic.lineStyle(this._lineThickness, 0x33ff33, 0.6);
					pathGraphic.position.x = 0;
					pathGraphic.position.y = 0;
					pathGraphic.moveTo(this.position.x, this.position.y);
					pathGraphic.lineTo(x, y);
					pathGraphic.drawCircle(x, y, 5);
					pathGraphic.endFill();
				}, this)
				.onComplete.add(function() {
					this._paths = _.filter(this._paths, function(path) {
						if(path.graphic === pathGraphic) {
							this._killPath(path);
							return false;
						} else {
							return true;
						}
						
					}, this);
				}, this);
			
			if(queueMovement && lastPath) {
				lastPath.move.onComplete.add(function() {
					moveTween.start();
					rotationTween.start();	
				});
			} else {
				moveTween.start();
				rotationTween.start();
			}
		},
		
		_killPath: function(path) {
			path.graphic.destroy();
			path.move.stop();
			path.rotation.stop();
		}
	};
});
