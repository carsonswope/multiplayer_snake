var CanvasHelper = require('../../../util/CanvasPos');
var RenderableComponent = require('./RenderableComponent');
var MathUtil = require('../../../util/MathUtil');
var COLORS = require('../../../colors.js')

function SnakeBodyCurve(originalPosition, screenSize, dir) {

  // dir looks like: .fromHead, .toTail
  this.dir = dir;
  RenderableComponent.call(this, originalPosition, screenSize);
}

SnakeBodyCurve.inherits(RenderableComponent);

SnakeBodyCurve.prototype.els = function(framePoint) {

  var fillColor = this.ownPlayer ?
    COLORS.OWN_PLAYER_SNAKE_BODY : COLORS.OTHER_PLAYER_SNAKE_BODY;
  var strokeColor = this.ownPlayer ?
    COLORS.OWN_PLAYER_SNAKE_OUTLINE : COLORS.OTHER_PLAYER_SNAKE_OUTLINE;

  return [{
    points: [ [-1, 1], [-1,0], [0,-1], [1,-1], [1,1]],
    fill: fillColor
  },{
    points: [ [-1, 1], [-1,0], [0,-1], [1,-1]],
    width: 4,
    stroke: strokeColor
  }]
};

SnakeBodyCurve.prototype.draw = function(ctx, framePoint, dY) {

  switch (MathUtil.getCurveType(this.dir)) {
    case 'topLeft':
      this.rotation = 0; break;
    case 'topRight':
      this.rotation = 1.5 * Math.PI; break;
    case 'botLeft':
      this.rotation = 0.5 * Math.PI; break;
    case 'botRight':
      this.rotation = 1   * Math.PI; break;
  }

  if (this.justAte) {
    this.scale = 1.3 + (0.5 * Math.sin(framePoint * Math.PI));
  } else {
    this.scale = 1;
  }

  this.toScreen(ctx, framePoint, dY);

};

module.exports = SnakeBodyCurve;
