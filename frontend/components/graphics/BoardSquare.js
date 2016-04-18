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
  ctx.strokeStyle = 'rgba(200,200,200,0.1)'
  ctx.lineWidth = 2;
  ctx.rect(pos[0] - h, pos[1] - h, this.squareSize - pad, this.squareSize - pad);
  ctx.stroke();

}


module.exports = BoardSquare;
