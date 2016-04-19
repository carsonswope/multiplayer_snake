var CanvasHelper = require('../../../util/CanvasPos');
var RenderableComponent = require('./RenderableComponent');

var NUMBER_POINTS = 10;
var MAGNITUDE = 2;
var LINE_WIDTH = 2;

function SnakeBodyStraight(originalPosition, screenSize, dir, idx) {
  this.dir = dir
  this.idx = idx;
  RenderableComponent.call(this, originalPosition, screenSize);
}

SnakeBodyStraight.inherits(RenderableComponent);

SnakeBodyStraight.prototype.draw = function(ctx, framePoint) {

  ctx.beginPath();

  var size = this.squareSize;

  if (this.justAte) {
    size = size * (1 + 0.5 * Math.sin(framePoint * Math.PI))
  }

  var h = size / 2;
  var pos = this.screenCoordinates;

  ctx.beginPath();
  ctx.fillStyle = '#00FF26';
  ctx.fillRect(pos[0] - h, pos[1] - h, size, size);
  ctx.fill();


  ctx.lineWidth = LINE_WIDTH * 2;
  ctx.strokeStyle = '#1DB835';

  if (this.dir[0] != 0) {
    ctx.beginPath();
    ctx.moveTo(pos[0] - size / 2, pos[1] - (size / 2 + LINE_WIDTH));
    ctx.lineTo(pos[0] - size / 2, pos[1] + (size / 2 + LINE_WIDTH));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(pos[0] + size / 2, pos[1] - (size / 2 + LINE_WIDTH));
    ctx.lineTo(pos[0] + size / 2, pos[1] + (size / 2 + LINE_WIDTH));
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(pos[0] - (size / 2 + LINE_WIDTH), pos[1] - size / 2);
    ctx.lineTo(pos[0] + (size / 2 + LINE_WIDTH), pos[1] - size / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(pos[0] - (size / 2 + LINE_WIDTH), pos[1] + size / 2);
    ctx.lineTo(pos[0] + (size / 2 + LINE_WIDTH), pos[1] + size / 2);
    ctx.stroke();
  }

};

module.exports = SnakeBodyStraight;
