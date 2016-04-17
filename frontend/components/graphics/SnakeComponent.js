var SnakeBodyStraight = require('./SnakeBodyStraight');

function SnakeComponent(positions, screenSize) {

  this.size = screenSize;

  this.screenSize = screenSize;

  this.bodySegments = [];

}

SnakeComponent.prototype.update = function(newSnake) {

  this.bodySegments = [];

  newSnake.snake.forEach(function(seg){
    this.bodySegments.push(
      new SnakeBodyStraight(seg, this.screenSize)
    )
  }.bind(this));
};

SnakeComponent.prototype.draw = function(ctx) {

  this.bodySegments.forEach(function(seg){
    seg.draw(ctx);
  });
}

module.exports = SnakeComponent;
