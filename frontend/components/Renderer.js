var CONSTANTS = require('../../constants');
var MathUtil = require('../../util/MathUtil');

var Apple = require('./graphics/AppleComponent');
var Snake = require('./graphics/SnakeComponent');
var BoardComponent = require('./graphics/BoardComponent');
var GameStore = require('../stores/GameStore');


function Renderer(context, screenSize) {
  this.ctx = context
  this.evenFrame = 0;
  this.startingTime = new Date();
  this.size = screenSize;
  this.snakes = {};
  this.deadSnakes = {};
  this.apples = {};
  this.board = new BoardComponent(this.size);
  requestAnimationFrame(this.tick.bind(this))

};

Renderer.prototype.scheduleNextFrame = function(time) {
  this.lastFrameTime = this.nextFrameTime;
  this.nextFrameTime = time;
};

Renderer.prototype.framePoint = function(){
  var frameP = (new Date() - this.lastFrameTime) / (this.nextFrameTime - this.lastFrameTime);

  if (this.lastFrameP > frameP) {
    this.evenFrame = !this.evenFrame ? 1 : 0;
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

  Object.keys(frame.players).forEach(function(id) {
    if (!id == GameStore.ownId() || !this.deadSnakes[id]){
      this.snakes[id] = this.snakes[id] || new Snake(this.snakes[id], this.size, this.gradientCanvas);
      this.snakes[id].update(frame.players[id], id == GameStore.ownId());
    }
  }.bind(this));

  Object.keys(frame.apples).forEach(function(id){
    this.apples[id] = new Apple(MathUtil.posParse(id), this.size);
    this.apples[id].updated = true;
  }.bind(this));

  Object.keys(this.apples).forEach(function(id){
    if (this.apples[id].updated){ this.apples[id].updated = false; }
    else { delete this.apples[id]; }
  }.bind(this))

  Object.keys(this.snakes).forEach(function(id){
    if (!frame.players[id]){
      this.deadSnakes[id] = this.snakes[id];
      delete this.snakes[id];
    }
  }.bind(this));

  Object.keys(this.deadSnakes).forEach(function(id){
    this.deadSnakes[id].frameCount = this.deadSnakes[id].frameCount || 0;
    this.deadSnakes[id].frameCount += 1;

    if (this.deadSnakes[id].frameCount > 3) {
      delete this.deadSnakes[id];
    }
  }.bind(this));

  this.board.update(this.snakes, GameStore.ownId());

};

Renderer.prototype.resize = function(newSize){
  this.size = newSize;
  this.board.resize(newSize);

  Object.keys(this.apples).forEach(function(id){
    this.apples[id].resize(this.size);
  }.bind(this));


  Object.keys(this.snakes).forEach(function(id){
    this.snakes[id].resize(this.size);
  }.bind(this));

};

Renderer.prototype.draw = function(time){

  var ctx = this.ctx;

  ctx.clearRect(0, 0, this.size.width, this.size.height);

  this.board.draw(ctx, this.timePoint(5000));

  Object.keys(this.apples).forEach(function(id){
    this.apples[id].draw(ctx);
  }.bind(this));

  Object.keys(this.snakes).forEach(function(id){
    this.snakes[id].draw(ctx);
  }.bind(this));

  Object.keys(this.deadSnakes).forEach(function(id){
    this.deadSnakes[id].draw(ctx);
  }.bind(this));


};

Renderer.prototype.tick = function(time){

  this.draw(time);

  requestAnimationFrame(this.tick.bind(this))

};

module.exports = Renderer;
