require('../../../util/Inheritance');
var CanvasHelper = require('../../../util/CanvasPos');
var MathUtil = require('../../../util/MathUtil');
var BoardSquare = require('./BoardSquare');

var Renderable = require('./RenderableComponent');

var MAX_DIST = 8;

function BoardComponent(size) {
  this.rows = CONSTANTS.BOARD.HEIGHT;
  this.cols = CONSTANTS.BOARD.WIDTH;
  this.size = size;

  this.elements = [];

  for (var row = 0; row < this.rows; row++) {
    for (var col = 0; col < this.cols; col++) {
      this.elements.push(
        new BoardSquare(
          [row, col], this.size
        )
      )
    }
  }

};

BoardComponent.inherits(Renderable);

BoardComponent.prototype.update = function(snakes, ownId) {

  var seen = {};
  var toSee = {};
  var nextRound = {};
  var posStr;

  this.elements.forEach(function(el){
    el.lastDistance = el.distance;
    el.touchedLast = false;
  });

  Object.keys(snakes).forEach(function(id){
    if (snakes[id].clientSnake) {
      snakes[id].bodySegments.forEach(function(seg){
        posStr = MathUtil.posStr(seg.position);
        toSee[posStr] = true;
      })
    }
  });

  nextRound = {};
  var k;
  var distance = 0;
  var current, posParse;

  while (Object.keys(toSee).length) {

    Object.keys(toSee).forEach(function(posStr){

      delete toSee[posStr];

      seen[posStr] = true;

      posParse = MathUtil.posParse(posStr);

      current = this.elements[
        posParse[0] * CONSTANTS.BOARD.WIDTH + posParse[1]
      ];

      current.distance = (distance / MAX_DIST);
      current.touchedLast = true;
      MathUtil.neighborPosStrs(posStr).forEach(function(neighborPosStr){
        posParse = MathUtil.posParse(neighborPosStr);
        if (!seen[neighborPosStr] &&
            !MathUtil.outOfBounds(posParse) &&
            distance < MAX_DIST) {

          nextRound[neighborPosStr] = true;

        }
      });

    }.bind(this));

    toSee = nextRound;
    distance = distance + 1;

  }

}

BoardComponent.prototype.resize = function(newSize){
  this.size = newSize;

  this.elements.forEach(function(el){
    el.resize(newSize);
  });

};


BoardComponent.prototype.draw = function(ctx, timePoint){

  // console.log(this.elements.length);
  // console.log(new Date());
  //
  this.elements.forEach(function(el){
    el.draw(ctx, timePoint);
  });

};


module.exports = BoardComponent;
