var CanvasHelper = require('../../../util/CanvasPos');

require('../../../util/Inheritance');

function RendererableComponent(position, screenSize, direction){
  this.position = position;

  this.direction = direction || 'N';

  var screenInfo = CanvasHelper.screenPos(position, screenSize);
  this.screenCoordinates = screenInfo.pos;
  this.squareSize = screenInfo.squareSize;
}

RendererableComponent.prototype.resize = function(newSize) {
  var screenInfo = CanvasHelper.screenPos(this.position, newSize);
  this.screenCoordinates = screenInfo.pos;
  this.squareSize = screenInfo.squareSize;
}

module.exports = RendererableComponent;
