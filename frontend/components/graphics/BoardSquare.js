var CanvasHelper = require('../../../util/CanvasPos');

var RenderableComponent = require('./RenderableComponent');

function BoardSquare(originalPosition, screenSize) {
  this.distance = 100;
  RenderableComponent.call(this, originalPosition, screenSize);
}

BoardSquare.inherits(RenderableComponent);

BoardSquare.prototype.draw = function(ctx, timePoint) {

  var time = timePoint ? timePoint: 1;

  var color;

  var opacityTimePercentage = Math.sin(time * 2 * Math.PI) * 0.25 + 0.75;

  var xTween = (this.position[1] + 0.0) / (CONSTANTS.BOARD.WIDTH + 0.0)
  //
  // this.distance = Math.min(
  //   Math.abs(xTween - timePoint),
  //   this.distance
  // );


  //
  // var newTimePoint = (timePoint - 0.5)
  // if (newTimePoint > 0){
  //   newTimePoint = newTimePoint * 2;
  //   if (Math.abs(xTween - timePoint) < 0.2) {
  //     this.distance = 0.1;
  //   }
  // }

  if (this.distance === 100) {
    ctx.strokeStyle = 'rgba(200,200,200,0)'
    ctx.lineWidth = 0;
    return;
  } else {
    ctx.strokeStyle = 'rgba(200,200,200,' + (1 - this.distance) + ')';
    ctx.lineWidth = 2 - (2 * this.distance);
  }

  var pad = 0;

  var h = (this.squareSize / 2) - (pad / 2);

  var pos = this.screenCoordinates;

  ctx.beginPath();
  ctx.rect(pos[0] - h, pos[1] - h, this.squareSize - pad, this.squareSize - pad);
  ctx.stroke();

}


module.exports = BoardSquare;
