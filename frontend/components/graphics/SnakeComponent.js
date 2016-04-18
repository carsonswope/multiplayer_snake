var SnakeBodyStraight = require('./SnakeBodyStraight');
var SnakeRadar = require('./SnakeRadar');

function SnakeComponent(positions, screenSize, radarImage) {

  this.radarImage = radarImage;
  this.size = screenSize;
  this.bodySegments = [];
  this.radarSegments = [];

}

SnakeComponent.prototype.update = function(newSnake) {

  if (newSnake.action == 'GROW') {

  } else if (newSnake.action == 'DIE') {

  }

  this.bodySegments = [];
  this.radarSegments = [];

  newSnake.snake.forEach(function(seg, i){
    this.bodySegments.push(
      new SnakeBodyStraight(seg, this.size)
    );

    if (i % 2 == 0){
      this.radarSegments.push(
        new SnakeRadar(seg, this.size, this.radarImage)
      );
    }

  }.bind(this));
};

SnakeComponent.prototype.resize = function (newSize) {
  this.size = newSize;
};

SnakeComponent.prototype.draw = function(ctx) {
  this.radarSegments.forEach(function(seg){
    seg.draw(ctx);
  });

  this.bodySegments.forEach(function(seg){
    seg.draw(ctx);
  });

};

module.exports = SnakeComponent;
