var CanvasHelper = require('../../../util/CanvasPos');
var COLORS = require('../../../colors.js')


var RenderableComponent = require('./RenderableComponent');

function AppleComponent(originalPosition, screenSize) {

  this.makePoints();

  RenderableComponent.call(this, originalPosition, screenSize);

}

AppleComponent.inherits(RenderableComponent);


AppleComponent.prototype.makePoints = function() {

  this.points = [];

  var detail = 10;
  var angle;

  for (var i = 0; i <= detail; i++) {
    angle = (i / detail) * Math.PI * 2;
    this.points.push([
      Math.sin(angle),
      Math.cos(angle)
    ]);
  }

};

AppleComponent.prototype.els = function(timePoint) {


  return [{
    points: this.points,
    fill: COLORS.APPLE_BODY,
    width: 4,
    stroke: COLORS.APPLE_OUTLINE
  },{
    points: [[0, -0.6], [0.1, -0.8], [0.1, -1.1], [0,-1.4], [-0.1, -1.6]],
    width: 2,
    stroke: COLORS.APPLE_STEM
  }];


};

AppleComponent.prototype.draw = function(ctx, timePoint) {


  this.scale = 0.6 + 0.2 * Math.sin(timePoint * Math.PI);
  this.rotation = 0 + 0.2 * Math.sin(timePoint * 2 * Math.PI);

  this.toScreen(ctx, timePoint);

}

module.exports = AppleComponent;
