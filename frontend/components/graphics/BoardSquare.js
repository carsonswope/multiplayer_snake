var CanvasHelper = require('../../../util/CanvasPos');

var RenderableComponent = require('./RenderableComponent');

function BoardSquare(originalPosition, screenSize) {
  this.distance = 1;
  this.lastDistance = 1;
  RenderableComponent.call(this, originalPosition, screenSize);
}

BoardSquare.inherits(RenderableComponent);

BoardSquare.prototype.els = function(framePoint) {

  var time = framePoint ? framePoint : 1;
  var distance, stroke, width;


  if (!this.touchedLast) {
    distance = 1;
    this.distance = 1;
  }

  if (this.lastDistance != this.distance) {
    distance = this.lastDistance + (this.distance - this.lastDistance) * time;
  } else {
    distance = this.distance;
  }

  if (distance == 1) {
    return [];
  } else {
    return [{
      points: [[-1,-1], [-1,1], [1,1], [1,-1], [-1,-1]],
      stroke: 'rgba(200,200,200,' + (1 - distance) + ')',
      width: 2 - (2 * distance)
    }]
  }


}

BoardSquare.prototype.draw = function(ctx, framePoint) {

  this.toScreen(ctx, framePoint);

}


module.exports = BoardSquare;
