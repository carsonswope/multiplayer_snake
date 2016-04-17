var CanvasHelper = require('../../../util/CanvasPos');

var RenderableComponent = require('./RenderableComponent');

function BoardSquare(originalPosition, screenSize) {
  RenderableComponent.call(this, originalPosition, screenSize);
}

BoardSquare.inherits(RenderableComponent);

BoardSquare.prototype.draw = function(ctx) {

  var pad = 0;

  var h = (this.squareSize / 2) - (pad / 2);

  var pos = this.screenCoordinates;

  ctx.beginPath();
  ctx.strokeStyle = '#9FD1CF'
  ctx.lineWidth = 0;
  ctx.fillStyle = '#D1E2E0'
  ctx.rect(pos[0] - h, pos[1] - h, this.squareSize - pad, this.squareSize - pad);
  ctx.fill();

}


module.exports = BoardSquare;
