var CanvasHelper = require('../../../util/CanvasPos');


require('../../../util/Inheritance');

function RenderableComponent(position, screenSize){
  this.position = position;
  this.screenSize = screenSize;
  this.scale = 1;
  this.rotation = 0;
  var screenInfo = CanvasHelper.screenPos(position, screenSize);
  this.screenCoordinates = screenInfo.pos;
  this.squareSize = screenInfo.squareSize;
}

RenderableComponent.prototype.resize = function(newSize) {
  var screenInfo = CanvasHelper.screenPos(this.position, newSize);
  this.screenCoordinates = screenInfo.pos;
  this.squareSize = screenInfo.squareSize;
}

RenderableComponent.prototype.toScreen = function (ctx, framePoint, dY) {
  // this.els()
  // if this.els() looks like this: [{
  //   points:  [[-1,-1], [ 1,-1], [ 1, 1], [ -1, 1]],
  //   fill:    'green',
  //   stroke:  'black',
  //   width: 3
  // }]
  //
  // it will draw a square, the size of this.squareSize, around the center.
  // also drawing upon:
  // this.rotation
  // this.scale

  var coord;

  if (!dY) { dY = 0; }

  this.els(framePoint).forEach(function(el){
    ctx.beginPath();
    if (el.fill  ) { ctx.fillStyle   = el.fill; }
    if (el.stroke) { ctx.strokeStyle = el.stroke; }
    if (el.width ) { ctx.lineWidth   = el.width; }

    el.points.forEach(function(point, i){
      coord = this.screenCoordinate(point);
      if (!i) { ctx.moveTo(coord[0], coord[1] + dY); }
      else {    ctx.lineTo(coord[0], coord[1] + dY); }
    }.bind(this));

    if (el.fill ) { ctx.fill();   }
    if (el.stroke){ ctx.stroke(); }



  }.bind(this));
};

var toAngleMag = function(point) {
  var i = 0;
  return {
    angle: Math.atan2(point[0], point[1]),
    mag: Math.sqrt(point[0] * point[0] + point[1] * point[1])
  };
};

var toPoint = function(angleMag) {
  return [
    Math.sin(angleMag.angle) * angleMag.mag,
    Math.cos(angleMag.angle) * angleMag.mag
  ];
};

RenderableComponent.prototype.screenCoordinate = function(relPoint) {


  var angleMag = toAngleMag(relPoint);
  angleMag.angle += this.rotation;
  angleMag.mag *= (this.squareSize * this.scale / 2);

  var point = toPoint(angleMag);

  // debugger;

  return [
    point[0] + this.screenCoordinates[0],
    point[1] + this.screenCoordinates[1]
  ];

};

module.exports = RenderableComponent;
