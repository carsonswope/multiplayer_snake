var CanvasHelper = require('../../../util/CanvasPos');
var RenderableComponent = require('./RenderableComponent');

function SnakeBodyTail(originalPosition, screenSize) {
  RenderableComponent.call(this, originalPosition, screenSize);
}

SnakeBodyTail.inherits(RenderableComponent);

SnakeBodyTail.prototype.draw = function(ctx) {
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
