require('../../../util/Inheritance');
var CanvasHelper = require('../../../util/CanvasPos');

var BoardSquare = require('./BoardSquare');

var Renderable = require('./RenderableComponent');

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

BoardComponent.prototype.resize = function(newSize){
  this.size = newSize;

  this.elements.forEach(function(el){
    el.resize(newSize);
  });

};


BoardComponent.prototype.draw = function(ctx){

  // console.log(this.elements.length);
  // console.log(new Date());
  //
  this.elements.forEach(function(el){
    el.draw(ctx);
  });

};


module.exports = BoardComponent;
