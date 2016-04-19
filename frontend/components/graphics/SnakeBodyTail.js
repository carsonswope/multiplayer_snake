var CanvasHelper = require('../../../util/CanvasPos');
var RenderableComponent = require('./RenderableComponent');

function SnakeBodyTail(originalPosition, screenSize, dir, stationary) {

  this.stationary = stationary;
  this.dir = dir;

  RenderableComponent.call(this, originalPosition, screenSize);
}

SnakeBodyTail.inherits(RenderableComponent);

SnakeBodyTail.prototype.els = function (framePoint) {

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
    fill: '#00FF26',
    width: 4,
    stroke: '#1DB835'
  }];

};

SnakeBodyTail.prototype.draw = function(ctx, framePoint) {


  this.rotation = Math.atan2(this.dir[0] * -1, this.dir[1]);

  this.toScreen(ctx, framePoint);

  return;

  var pad = 1;
  var h = (this.squareSize / 2) - (pad / 2);
  var pos = this.screenCoordinates;
  ctx.beginPath();
  ctx.fillStyle = 'black'
  ctx.rect(pos[0] - h, pos[1] - h, this.squareSize - pad, this.squareSize - pad);
  ctx.closePath();
  ctx.fill();

};

module.exports = SnakeBodyTail;
