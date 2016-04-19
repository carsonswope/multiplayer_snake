var CanvasHelper = require('../../../util/CanvasPos');
var RenderableComponent = require('./RenderableComponent');

var DIGESTION_TIME_PER_SEGMENT = 80;

function DigestingApple(originalPosition, screenSize, snakeSegs) {
  this.snakeSegs = snakeSegs;
  this.timeEaten = new Date();
  this.completed = false;

  RenderableComponent.call(this, originalPosition, screenSize);
}

DigestingApple.inherits(RenderableComponent);

DigestingApple.prototype.els = function(framePoint) {

  return [{
    points: [[-1,-1], [-1,1], [1,1], [1,-1]],
    fill: 'red'
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

    this.scale = 0.8;

    this.toScreen(ctx, framePoint)

  } else if (normalizedTimeElapsed > this.snakeSegs.length + 1) {

    this.completed = true;

  }


};

module.exports = DigestingApple;
