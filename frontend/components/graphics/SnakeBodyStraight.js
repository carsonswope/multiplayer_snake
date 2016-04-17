var CanvasHelper = require('../../../util/CanvasPos');
var RenderableComponent = require('./RenderableComponent');

function SnakeBodyStraight(originalPosition, screenSize) {
  RenderableComponent.call(this, originalPosition, screenSize);
}

SnakeBodyStraight.inherits(RenderableComponent);

SnakeBodyStraight.prototype.draw = function(ctx) {

  debugger;

  var pad = 5;
  var h = (this.squareSize / 2) - (pad / 2);
  var pos = this.screenCoordinates;
  ctx.beginPath();
  ctx.fillStyle = '#2CDB32'
  ctx.rect(pos[0] - h, pos[1] - h, this.squareSize - pad, this.squareSize - pad);
  ctx.fill();

};

module.exports = SnakeBodyStraight;
