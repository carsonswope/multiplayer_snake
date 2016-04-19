var CanvasHelper = require('../../../util/CanvasPos');

var RenderableComponent = require('./RenderableComponent');

function BoardSquare(originalPosition, screenSize) {
  this.distance = 1;
  this.lastDistance = 1;
  RenderableComponent.call(this, originalPosition, screenSize);
}

BoardSquare.inherits(RenderableComponent);

BoardSquare.prototype.draw = function(ctx, timePoint) {

  var time = timePoint ? timePoint : 1;

  var distance;

  if (!this.touchedLast) {
    distance = 1;
    this.distance = 1;
  }

  if (this.lastDistance != this.distance) {
    distance = this.lastDistance + (this.distance - this.lastDistance) * timePoint;
  } else {
    distance = this.distance;
  }

  if (distance === 1) {
    ctx.strokeStyle = 'rgba(200,200,200,0)'
    ctx.lineWidth = 0;
    return;
  } else {
    ctx.strokeStyle = 'rgba(200,200,200,' + (1 - distance) + ')';
    ctx.lineWidth = 2 - (2 * distance);
  }

  var pad = 1;

  var h = (this.squareSize / 2) - (pad / 2);

  var pos = this.screenCoordinates;

  ctx.beginPath();
  ctx.rect(pos[0] - h, pos[1] - h, this.squareSize - pad, this.squareSize - pad);
  ctx.stroke();

}


module.exports = BoardSquare;
