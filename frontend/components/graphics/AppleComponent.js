var CanvasHelper = require('../../../util/CanvasPos');

var RenderableComponent = require('./RenderableComponent');

function AppleComponent(originalPosition, screenSize) {

  RenderableComponent.call(this, originalPosition, screenSize);

}

AppleComponent.inherits(RenderableComponent);

AppleComponent.prototype.draw = function(ctx) {

  var pad = 5;
  var h = (this.squareSize / 2) - (pad / 2);
  var pos = this.screenCoordinates;
  ctx.beginPath();
  ctx.fillStyle = '#DB2C40'
  ctx.rect(pos[0] - h, pos[1] - h, this.squareSize - pad, this.squareSize - pad);
  ctx.fill();

}

module.exports = AppleComponent;
