var CanvasHelper = require('../../../util/CanvasPos');
var RenderableComponent = require('./RenderableComponent');
var COLORS = require('../../../colors.js')

function SnakeBodyHead(originalPosition, screenSize, dir, justBorn) {
  this.justBorn = justBorn;
  this.dir = dir;
  RenderableComponent.call(this, originalPosition, screenSize);
}

SnakeBodyHead.inherits(RenderableComponent);

SnakeBodyHead.prototype.els = function (framePoint) {

  if (framePoint > 1) {
    debugger;
  }

  var fillColor = this.ownPlayer ?
    COLORS.OWN_PLAYER_SNAKE_BODY : COLORS.OTHER_PLAYER_SNAKE_BODY;
  var strokeColor = this.ownPlayer ?
    COLORS.OWN_PLAYER_SNAKE_OUTLINE : COLORS.OTHER_PLAYER_SNAKE_OUTLINE;

  var cutoff = 0.5;
  var points, els;

  if (this.stationary && !this.justBorn) { framePoint = 1; }

  if (this.justBorn) {

    points = [[-1,-1], [-1,1], [1,1], [1,-1], [-1,-1]];

    console.log(framePoint);
    this.scale = Math.sin(framePoint * Math.PI * (3/4)) * Math.sqrt(2);

  } else if (this.stationary) {

    points = [[-1,-1], [-1,1], [1,1], [1,-1], [-1,-1]];

  } else {

    points = [
      [-1, -1],
      [-1 + (framePoint * 2), -1 + cutoff],
      [-1 + (framePoint * 2),  1 - cutoff],
      [-1, 1]
    ];

  }


  return [{
    points: points,
    fill: fillColor,
    width: 4,
    stroke: strokeColor
  }];

};

SnakeBodyHead.prototype.draw = function(ctx, framePoint, dY) {

  if (!this.dir) {
    this.stationary = true;
    this.rotation = 0;
  } else {
    this.stationary = false;
    this.rotation = Math.atan2(this.dir[0], this.dir[1] * -1);
  }

  if (this.justAte) {
    this.scale = 1.3 + (0.5 * Math.sin(framePoint * Math.PI));
  } else {
    this.scale = 1;
  }


  this.toScreen(ctx, framePoint, dY);

};

module.exports = SnakeBodyHead;
