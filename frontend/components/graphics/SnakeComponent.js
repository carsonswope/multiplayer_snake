var SnakeBodyStraight = require('./SnakeBodyStraight');

function SnakeComponent(positions, screenSize) {

  this.size = screenSize;
  this.bodySegments = [];

}

SnakeComponent.prototype.update = function(newSnake, clientSnake) {

  this.clientSnake = clientSnake;

  if (newSnake.action == 'GROW') {

  } else if (newSnake.action == 'DIE') {

  }

  this.bodySegments = [];

  newSnake.snake.forEach(function(seg, i){
    this.bodySegments.push(
      new SnakeBodyStraight(seg, this.size)
    );

  }.bind(this));
};

SnakeComponent.prototype.resize = function (newSize) {
  this.size = newSize;
};

SnakeComponent.prototype.draw = function(ctx) {

  this.bodySegments.forEach(function(seg){
    seg.draw(ctx);
  });

};

module.exports = SnakeComponent;
