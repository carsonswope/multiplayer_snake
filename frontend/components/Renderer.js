function Renderer(context) {

  this.ctx = context
  this.lastFrameTime;
  this.nextFrameTime;
  this.currentFrame;
  this.evenFrame = 0;
  this.startingTime = new Date();

  this.snakes = [];
  this.apples = [];

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
};

Renderer.prototype.updateComponents = function() {

  this.snakes.forEach(function(snake){

    // frame.

    // snake.passState(frame);
  })

  this.currentFrame

}

Renderer.prototype.tick = function(time){

  this.timePoint(1000);

  console.log(this.timePoint(1000));

  console.log(this.currentFrame);


  // console.log(this.currentFrame);
  // console.log(this.halfFramePoint());

  if (!this.currentFrame) {
    requestAnimationFrame(this.tick.bind(this))

  }

};

module.exports = Renderer;
