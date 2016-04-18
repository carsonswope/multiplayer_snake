var RenderableComponent = require('./RenderableComponent');

var OUTER_GRADIENT_RADIUS = 100;
var INNER_GRADIENT_RADIUS = 50;

var CanvasHelper = require('../../../util/CanvasPos');

var LINE_WIDTH = 2;

var GRADIENT_COLOR = '#a0c';

function SnakeRadar(position, screenSize, radarImage){

  this.radarImage = radarImage;

  RenderableComponent.call(this, position, screenSize);

}

SnakeRadar.inherits(RenderableComponent);

SnakeRadar.prototype.outerGradientRadius = function(){
  return this.squareSize * 8;
}

SnakeRadar.prototype.innerGradientRadius = function(){
  return this.squareSize * 0;
}

SnakeRadar.prototype.startCoordDynamic = function(pos, i, dir, offset, bound) {
  var pos = dir == 'PLUS' ?
    (pos + (this.squareSize / 2)) - (LINE_WIDTH / 2) + (i * this.squareSize) :
    (pos - (this.squareSize / 2)) - (LINE_WIDTH / 2) - (i * this.squareSize);

  if (pos < offset - LINE_WIDTH || pos > bound - offset) {
    return NaN;
  }

  return pos;
};

SnakeRadar.prototype.startCoordStatic = function(pos, offset) {
  return Math.max(pos - this.outerGradientRadius(), offset);
}

SnakeRadar.prototype.lineLength = function(pos, offset, type) {
  var bound = type == 'VERTICAL' ?
    this.screenSize.height : this.screenSize.width;

  return Math.min(
    (pos + (this.squareSize / 2)) + (this.outerGradientRadius() * 2),
    (bound - offset) - this.startCoordStatic(pos, offset)
  )

}

SnakeRadar.prototype.draw = function(ctx) {

  var pos = this.screenCoordinates;

  var gradient = ctx.createRadialGradient(
    pos[0], pos[1], this.outerGradientRadius(),
    pos[0], pos[1], this.innerGradientRadius()
  );

  gradient.addColorStop(0, 'transparent');
  gradient.addColorStop(1, 'rgba(120,160,180,0.2)');

  ctx.fillStyle = gradient;


  var i = 0;

  var offset = CanvasHelper.getOffset(this.screenSize, this.squareSize);

  while (i * this.squareSize < this.outerGradientRadius()) {

    ['MINUS', 'PLUS'].forEach(function(dir){
      ctx.fillRect(
        this.startCoordDynamic(pos[0], i, dir, offset[1], this.screenSize.width),
        this.startCoordStatic(pos[1], offset[0]),
        LINE_WIDTH,
        this.lineLength(pos[1], offset[0], 'VERTICAL')
      );

      ctx.fillRect(
        this.startCoordStatic(pos[0], offset[1]),
        this.startCoordDynamic(pos[1], i, dir, offset[0], this.screenSize.height),
        this.lineLength(pos[0], offset[1], 'HORIZONTAL'),
        LINE_WIDTH
      );

    }.bind(this));

    i += 1;
  }




  // ctx.fillRect(pos[0], pos[1], 80,80);
  //
  //
  // ctx.fillStyle = 'green';
  // ctx.fill();
  // // ctx.clearRect(0,0,400,400);
  // // debugger;

};

module.exports = SnakeRadar;
