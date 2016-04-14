var MathUtil = require('./MathUtil');

function Player(options){
  this.id =     options.id    || id;
  this.name =   options.name  || undefined;
  this.snake =  options.snake || [];
  this.state =  options.state || CONSTANTS.PLAYER_STATES.DEAD;
  this.dir =    options.dir   || undefined;
  this.lastApproved = options.lastApproved ||
    {
      snake: [],
      frame: undefined
    }
};

Player.fromJSON = function(json){
  return new Player(JSON.parse(json));
};

Player.prototype.json = function(){
  return JSON.stringify(this);
};

Player.prototype.canPlace = function(){
  return this.state === CONSTANTS.PLAYER_STATES.DEAD;
};

Player.prototype.place = function(newPos){
  this.snake = [newPos];
  this.state = CONSTANTS.PLAYER_STATES.PLACED;
}

Player.prototype.canChangeDir = function(){
  return this.state !== CONSTANTS.PLAYER_STATES.DEAD;
};

Player.prototype.changeDir = function(newDir){
  this.dir = newDir;
  this.state = CONSTANTS.PLAYER_STATES.PLAYING;
};

Player.prototype.nextPos = function(){
  if (!this.dir) { return; }
  return MathUtil.posSum(
    this.snake[0],
    CONSTANTS.DIRS[this.dir]
  );
};

Player.prototype.handleClientSetPositionRequest = function(pos) {
  if (this.canPlace()) { this.place(pos); }
};

Player.prototype.handleClientSetDirectionRequest = function(request) {
    this.snake = request.snake;
    this.dir = request.dir;
    this.tick();
};

Player.prototype.acceptableFrameToRequest = function(frame) {

  // first make sure the request is not for any frame prior to
  // the last approved and confirmed frame

  // if (!this.lastApproved.frame || this.lastApproved.frame < frame){
  //
  //   // frames is float, representing number of frames away from the
  //   // current state of the server that the request proposes to change
  //
  //   //    req      now    <- this would be value of -2.25
  //   //     |        |
  //   // |---|---|---|---|
  //   // 0   1   2   3   4  <- timeline of server ticks
  //   var framesAwayFromServerState =
  //     ((frame) - _frameNumber) +
  //     ((new Date().getTime()   - _lastFrameTime) / _serverDTAvg);
  //
  //   var framesAwayFromLastApproved = (frame) - this.lastApproved.frame;
  //
  //   if (framesAwayFromServerState > CONSTANTS.SERVER_FRAME_RANGE.lo &&
  //       framesAwayFromServerState < CONSTANTS.SERVER_FRAME_RANGE.hi ) {
  //     return true;
  //   }
  //   return false;
  // }

  return true;

};

Player.prototype.tick = function(){
  if (this.nextPos()){
    this.snake.unshift(this.nextPos());
  }
  if (this.snake.length > 10) { this.snake.pop(); }
};

module.exports = Player;
