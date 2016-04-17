var CONSTANTS = require('../../constants');
var MathUtil = require('../../util/MathUtil');

var Apple = require('./graphics/AppleComponent');
var Snake = require('./graphics/SnakeComponent');
var BoardComponent = require('./graphics/BoardComponent');

function Renderer(context, screenSize) {

  this.ctx = context
  this.lastFrameTime;
  this.nextFrameTime;
  this.currentFrame;
  this.evenFrame = 0;
  this.startingTime = new Date();

  this.size = screenSize;

  this.snakes = {};
  this.apples = {};
  this.board = new BoardComponent(this.size);

  requestAnimationFrame(this.tick.bind(this))

};

Renderer.prototype.scheduleNextFrame = function(time) {
  this.lastFrameTime = this.nextFrameTime;
  this.nextFrameTime = time;

  // console.log(time);
};

Renderer.prototype.framePoint = function(){
  var frameP = (new Date() - this.lastFrameTime) / (this.nextFrameTime - this.lastFrameTime);
  if (this.lastFrameP > frameP) {
    this.evenFrame = !this.evenFrame ?
      1 : 0;
  }

  this.lastFrameP = frameP;
  return frameP;
};

Renderer.prototype.halfFramePoint = function(){
  return this.evenFrame + this.framePoint();
};

Renderer.prototype.timePoint = function(interval){
  return ((new Date().getTime() - this.startingTime.getTime()) % interval) / interval;
};

Renderer.prototype.giveCurrentFrame = function(frame) {
  this.currentFrame = frame;
  this.updateComponents();

};

Renderer.prototype.updateComponents = function() {

  Object.keys(this.currentFrame.players).forEach(function(id){
    this.snakes[id] = this.snakes[id] || new Snake(this.snakes[id], this.size);
    this.snakes[id].update(this.currentFrame.players[id]);
  }.bind(this));

  Object.keys(this.currentFrame.apples).forEach(function(id){
    this.apples[id] = new Apple(MathUtil.posParse(id), this.size);
    this.apples[id].updated = true;
  }.bind(this));

  Object.keys(this.apples).forEach(function(id){
    if (this.apples[id].updated){
      this.apples[id].updated = false;
    } else {
      delete this.apples[id];
    }
  }.bind(this))

}

Renderer.prototype.resize = function(newSize){
  this.size = newSize;
  this.board.resize(newSize);
};

Renderer.prototype.draw = function(time){

  var ctx = this.ctx;
  ctx.clearRect(0, 0, this.size.width, this.size.height);
  this.board.draw(ctx);

  Object.keys(this.apples).forEach(function(id){
    this.apples[id].draw(ctx);
  }.bind(this));

  Object.keys(this.snakes).forEach(function(id){
    this.snakes[id].draw(ctx);
  }.bind(this));

};

Renderer.prototype.tick = function(time){

  this.draw(time);

  requestAnimationFrame(this.tick.bind(this))

};

module.exports = Renderer;
