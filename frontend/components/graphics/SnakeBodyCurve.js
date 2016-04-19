var CanvasHelper = require('../../../util/CanvasPos');
var RenderableComponent = require('./RenderableComponent');
var MathUtil = require('../../../util/MathUtil');

function SnakeBodyCurve(originalPosition, screenSize, dir) {

  // dir looks like: .fromHead, .toTail

  this.dir = dir;
  RenderableComponent.call(this, originalPosition, screenSize);
}

SnakeBodyCurve.inherits(RenderableComponent);

SnakeBodyCurve.prototype.draw = function(ctx, framePoint) {

  var size = this.squareSize;
  if (this.justAte) {
    size = size * (1 + 0.5 * Math.sin(framePoint * Math.PI))
  }

  var pad = 5;
  var h = (this.squareSize / 2) - (pad / 2);
  var pos = this.screenCoordinates;

  var half = size / 2;

  var plus = function(pos) { return pos + half; }
  var minus = function(pos){ return pos - half; }
  var mid = function(pos)  { return pos; }

  var ops = {
    topLeft:  [ [minus, plus], [minus, mid], [mid, minus], [plus, minus], [plus, plus] ],
    topRight: [ [plus,  plus], [plus,  mid], [mid, minus], [minus,minus], [minus,plus] ],
    botLeft:  [ [minus,minus], [minus, mid], [mid, plus ], [plus, plus ], [plus,minus] ],
    botRight: [ [plus, minus], [plus,  mid], [mid, plus ], [minus,plus ], [minus,minus]]
  }

  ctx.lineWidth = 4;
  ctx.fillStyle = '#00FF26';
  ctx.strokeStyle = '#1DB835';

  var t = MathUtil.getCurveType(this.dir);

  ctx.beginPath();
  ctx.moveTo(ops[t][0][0](pos[0]), ops[t][0][1](pos[1]));
  ctx.lineTo(ops[t][1][0](pos[0]), ops[t][1][1](pos[1]));
  ctx.lineTo(ops[t][2][0](pos[0]), ops[t][2][1](pos[1]));
  ctx.lineTo(ops[t][3][0](pos[0]), ops[t][3][1](pos[1]));
  ctx.lineTo(ops[t][4][0](pos[0]), ops[t][4][1](pos[1]));
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(ops[t][0][0](pos[0]), ops[t][0][1](pos[1]));
  ctx.lineTo(ops[t][1][0](pos[0]), ops[t][1][1](pos[1]));
  ctx.lineTo(ops[t][2][0](pos[0]), ops[t][2][1](pos[1]));
  ctx.lineTo(ops[t][3][0](pos[0]), ops[t][3][1](pos[1]));
  ctx.stroke();


};

module.exports = SnakeBodyCurve;
