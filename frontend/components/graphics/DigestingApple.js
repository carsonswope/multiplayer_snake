var CanvasHelper = require('../../../util/CanvasPos');
var RenderableComponent = require('./RenderableComponent');
var COLORS = require('../../../colors');

var DIGESTION_TIME_PER_SEGMENT = 80;

function DigestingApple(originalPosition, screenSize, snakeSegs) {
  this.snakeSegs = snakeSegs;
  this.timeEaten = new Date();
  this.makePoints();
  this.completed = false;

  RenderableComponent.call(this, originalPosition, screenSize);
}

DigestingApple.inherits(RenderableComponent);


DigestingApple.prototype.makePoints = function() {

  this.points = [];

  var detail = 6;
  var angle;

  for (var i = 0; i <= detail; i++) {
    angle = (i / detail) * Math.PI * 2;
    this.points.push([
      Math.sin(angle),
      Math.cos(angle)
    ]);
  }

};

DigestingApple.prototype.els = function(framePoint) {

  return [{
    points: this.points,
    fill: COLORS.APPLE_BODY_RGBA(1),
    width: 4,
    stroke: COLORS.APPLE_OUTLINE_RGBA(1)
  }];

};

DigestingApple.prototype.draw = function(ctx, framePoint) {

  var timeElapsed = new Date() - (this.timeEaten);

  var normalizedTimeElapsed = (timeElapsed / DIGESTION_TIME_PER_SEGMENT);

  var idx1 = Math.floor(normalizedTimeElapsed);
  var idx2 = idx1 + 1;
  var pctDiff = normalizedTimeElapsed - idx1;

  if (idx1 > -1 && this.snakeSegs[idx2]) {

    var seg1 = this.snakeSegs[idx1];
    var seg2 = this.snakeSegs[idx2];

    var dCoord = [
      seg2[0] - seg1[0],
      seg2[1] - seg1[1]
    ];

    var scrnPos1 = CanvasHelper.screenPos(seg1, this.screenSize).pos;
    var scrnPos2 = CanvasHelper.screenPos(seg2, this.screenSize).pos;

    var dPos = [
      scrnPos2[0] - scrnPos1[0],
      scrnPos2[1] - scrnPos1[1]
    ];

    this.screenCoordinates = [
      scrnPos1[0] + (dPos[0] * pctDiff),
      scrnPos1[1] + (dPos[1] * pctDiff)
    ]

    this.scale = 1 - (normalizedTimeElapsed / this.snakeSegs.length);
    this.toScreen(ctx, normalizedTimeElapsed / this.snakeSegs.length)

  } else if (normalizedTimeElapsed > this.snakeSegs.length + 1) {

    this.completed = true;

  }


};

module.exports = DigestingApple;
