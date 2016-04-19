var SnakeBodyStraight = require('./SnakeBodyStraight');
var SnakeBodyCurve = require('./SnakeBodyCurve');
var SnakeBodyTail = require('./SnakeBodyTail');
var SnakeBodyHead = require('./SnakeBodyHead');
var DigestingApple = require('./DigestingApple');

var MathUtil = require('../../../util/MathUtil');


function SnakeComponent(positions, screenSize) {

  this.size = screenSize;
  this.bodySegments = [];
  this.digestingApples = {};
  this.applesEaten = 1;

}

SnakeComponent.prototype.update = function(newSnake, clientSnake) {

  this.justAte = false;

  this.clientSnake = clientSnake;

  Object.keys(this.digestingApples).forEach(function(id){
    this.digestingApples[id].snakeSegs.pop();
  }.bind(this));

  if (newSnake.action == 'GROW') {

    this.digestingApples[this.applesEaten] =
      new DigestingApple(newSnake.snake[0], this.size, newSnake.snake);

    this.applesEaten += 1;
    this.justAte = true;

  } else if (newSnake.action == 'DIE') {



  }

  var oldCoord = this.bodySegments[this.bodySegments.length - 1];

  this.bodySegments = [];

  var dir;

  newSnake.snake.forEach(function(seg, i){

    dir = MathUtil.getDir(newSnake.snake[i - 1], seg, newSnake.snake[i + 1]);

    var newSeg;

    if (i == 0){
      newSeg = new SnakeBodyHead(seg, this.size, dir.toTail, i)

    } else if ( i == newSnake.snake.length - 1){
      var stationary = oldCoord && MathUtil.posStr(oldCoord.position) == MathUtil.posStr(seg);
      newSeg = new SnakeBodyTail(seg, this.size, dir.fromHead, stationary)

    } else if ( MathUtil.curved(dir) ){
      // debugger
      newSeg = new SnakeBodyCurve(seg, this.size, dir)

    } else {
      newSeg = new SnakeBodyStraight(seg, this.size, dir.toTail, i)

    }

    newSeg.justAte = this.justAte;

    this.bodySegments.push(newSeg);


  }.bind(this));
};

SnakeComponent.prototype.resize = function (newSize) {
  this.size = newSize;
};

SnakeComponent.prototype.draw = function(ctx, framePoint) {

  this.bodySegments.forEach(function(seg, i){
    this.bodySegments[this.bodySegments.length - (1 + i)].draw(ctx, framePoint);
  }.bind(this));

  var app;

  Object.keys(this.digestingApples).forEach(function(id){
    app = this.digestingApples[id];
    if (app.completed) { delete this.digestingApples[id]; }
    else { app.draw(ctx, framePoint) };


  }.bind(this));


};

module.exports = SnakeComponent;
