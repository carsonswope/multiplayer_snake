var SnakeBodyStraight = require('./SnakeBodyStraight');
var SnakeBodyCurve = require('./SnakeBodyCurve');
var SnakeBodyTail = require('./SnakeBodyTail');
var SnakeBodyHead = require('./SnakeBodyHead');
var DigestingApple = require('./DigestingApple');

var MathUtil = require('../../../util/MathUtil');
var CONSTANTS = require('../../../constants.js');


function SnakeComponent(positions, screenSize, ownPlayer) {

  this.size = screenSize;
  this.bodySegments = [];
  this.digestingApples = {};
  this.applesEaten = 1;
  this.ownPlayer = ownPlayer;

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

    console.log('died!');


  }

  var oldCoord = this.bodySegments[this.bodySegments.length - 1];
  var justBorn = false;

  if (!this.bodySegments.length && newSnake.snake.length) {
    justBorn = true;
  }

  this.bodySegments = [];

  var dir;

  newSnake.snake.forEach(function(seg, i){

    dir = MathUtil.getDir(newSnake.snake[i - 1], seg, newSnake.snake[i + 1]);

    var newSeg;

    if (i == 0){
      newSeg = new SnakeBodyHead(seg, this.size, dir.toTail, justBorn)
    } else if ( i == newSnake.snake.length - 1){
      var stationary = oldCoord && MathUtil.posStr(oldCoord.position) == MathUtil.posStr(seg);
      newSeg = new SnakeBodyTail(seg, this.size, dir.fromHead, stationary)
    } else if ( MathUtil.curved(dir) ){
      newSeg = new SnakeBodyCurve(seg, this.size, dir)
    } else {
      newSeg = new SnakeBodyStraight(seg, this.size, dir.toTail)
    }

    newSeg.ownPlayer = this.ownPlayer;
    newSeg.justAte = this.justAte;

    this.bodySegments.push(newSeg);


  }.bind(this));
};

SnakeComponent.prototype.resize = function (newSize) {
  this.size = newSize;
};

SnakeComponent.prototype.draw = function(ctx, framePoint) {

  if (this.dead) {

    var dY = (((this.frameCount - 1) + framePoint) / CONSTANTS.SNAKE_DEATH_FRAMES) * (this.size.height);

    this.bodySegments.forEach(function(seg){
      seg.draw(ctx, 1, dY);
    }.bind(this));

  } else {

    this.bodySegments.forEach(function(seg){
      seg.draw(ctx, framePoint);
    }.bind(this));

    var app;

    Object.keys(this.digestingApples).forEach(function(id){
      app = this.digestingApples[id];
      if (app.completed) {
        delete this.digestingApples[id];
      }
      else { app.draw(ctx, framePoint) };


    }.bind(this));

  }


};

module.exports = SnakeComponent;
