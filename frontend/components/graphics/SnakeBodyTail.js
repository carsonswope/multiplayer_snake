var CanvasHelper = require('../../../util/CanvasPos');
var RenderableComponent = require('./RenderableComponent');
var COLORS = require('../../../colors.js')


function SnakeBodyTail(originalPosition, screenSize, dir, stationary) {

  this.stationary = stationary;
  this.dir = dir;

  RenderableComponent.call(this, originalPosition, screenSize);
}

SnakeBodyTail.inherits(RenderableComponent);

SnakeBodyTail.prototype.els = function (framePoint) {

  var fillColor = this.ownPlayer ?
    COLORS.OWN_PLAYER_SNAKE_BODY : COLORS.OTHER_PLAYER_SNAKE_BODY;
  var strokeColor = this.ownPlayer ?
    COLORS.OWN_PLAYER_SNAKE_OUTLINE : COLORS.OTHER_PLAYER_SNAKE_OUTLINE;

  var cutoff = 0.5;

  if (this.stationary) { framePoint = 0; }
  // framePoint = framePoint * 5;

  var points = [
    [-1, -1],
    [(1-(framePoint * 2)), -1 + cutoff],
    [(1-(framePoint * 2)),  1 - cutoff],
    [-1, 1]
  ];

  return [{
    points: points,
    fill: fillColor,
    width: 4,
    stroke: strokeColor
  }];

};

SnakeBodyTail.prototype.draw = function(ctx, framePoint, dY) {


  this.rotation = Math.atan2(this.dir[0] * -1, this.dir[1]);

  if (this.justAte) {
    this.scale = 1.3 + (0.5 * Math.sin(framePoint * Math.PI));
  } else {
    this.scale = 1;
  }


  this.toScreen(ctx, framePoint, dY);

};

module.exports = SnakeBodyTail;
