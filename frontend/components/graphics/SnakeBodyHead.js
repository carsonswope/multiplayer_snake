var CanvasHelper = require('../../../util/CanvasPos');
var RenderableComponent = require('./RenderableComponent');

function SnakeBodyHead(originalPosition, screenSize, dir) {
  this.dir = dir;
  RenderableComponent.call(this, originalPosition, screenSize);
}

SnakeBodyHead.inherits(RenderableComponent);

SnakeBodyHead.prototype.els = function (framePoint) {

  var cutoff = 0.5;

  if (this.stationary) { framePoint = 1; }
  // framePoint = framePoint * 5;

  var points = [
    [-1, -1],
    [-1 + (framePoint * 2), -1 + cutoff],
    [-1 + (framePoint * 2),  1 - cutoff],
    [-1, 1]
  ];

  return [{
    points: points,
    fill: '#00FF26',
    width: 4,
    stroke: '#1DB835'
  }];

};

SnakeBodyHead.prototype.draw = function(ctx, framePoint) {

  if (!this.dir) {
    this.stationary = true;
    this.rotation = 0;
  } else {
    this.stationary = false;
    this.rotation = Math.atan2(this.dir[0], this.dir[1] * -1);
  }

  this.toScreen(ctx, framePoint);

};

module.exports = SnakeBodyHead;
