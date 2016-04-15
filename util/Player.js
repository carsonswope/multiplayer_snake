var MathUtil = require('./MathUtil');

function Player(options){
  this.id =     options.id      || id;
  this.name =   options.name    || undefined;
  this.snake =  options.snake   || [];
  this.state =  options.state   || CONSTANTS.PLAYER_STATES.DEAD;
  this.dir =    options.dir     || undefined;
  this.length = options.length  || 10;
  this.frame =  options.frame   || undefined;
  this.action =  options.action || undefined;
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

Player.prototype.place = function(newPos, frame){
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

Player.prototype.snakeAtFrame = function(frame){

  if (!this.snake.length) { return []; }

  var tempSnake = [].concat(this.snake);
  var tempLength = this.length

  if (frame >= this.frame) {

    // debugger;

    for (var i = 0; i < frame - this.frame; i++) {
      if (this.dir) {
        tempSnake.unshift( MathUtil.posSum( tempSnake[0], CONSTANTS.DIRS[this.dir] ));
      }
      if (tempSnake.length > tempLength) { tempSnake.pop(); }
    }

  } else {


    var tailDir = MathUtil.posDif(
      tempSnake[tempSnake.length - 2 ],
      tempSnake[tempSnake.length - 1 ]
    );

    for (var i = 0; i < this.frame - frame; i++) {
      tempSnake.shift();
      tempSnake.push(
        MathUtil.posSum ( tempSnake[tempSnake.length - 1], tailDir )
      )
    }

  }

  return tempSnake;

};

Player.prototype.snakeHeadAtFrame = function(frame){

  return this.snakeAtFrame(frame)[0];

}

Player.prototype.handleClientSetPositionRequest = function(pos, frame) {

  if (this.canPlace()) { this.place(pos); }
  this.frame = frame;

};

Player.prototype.handleClientSetDirectionRequest = function(request) {

  if (!this.canChangeDir()) { return; }
  this.state = CONSTANTS.PLAYER_STATES.PLAYING;
  this.snake = request.snake;
  this.dir = request.dir;
  this.frame = request.frame

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

Player.prototype.tick = function(applePositions, appleReset){
  if (this.nextPos()){

    if (applePositions) {
      console.log(applePositions);

      applePositions.forEach(function(apple, i){
        if (MathUtil.stepsAway(apple, this.snake[0]) == 0) {
          this.length += 1;
          appleReset(i);
        }

      }.bind(this) );
    }

    this.snake.unshift(this.nextPos());
  }
  if (this.snake.length > this.length) { this.snake.pop(); }
};

module.exports = Player;
