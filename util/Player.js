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
  this.dir = 'NONE';
  this.action = undefined;
  this.length = CONSTANTS.STARTING_SNAKE_LENGTH;
  this.state = CONSTANTS.PLAYER_STATES.PLACED;
}
Player.prototype.canChangeDir = function(){
  return this.state !== CONSTANTS.PLAYER_STATES.DEAD;
};

Player.prototype.changeDir = function(newDir){
  this.dir = newDir;
  this.state = CONSTANTS.PLAYER_STATES.PLAYING;
};

Player.prototype.snakeAtFrame = function(frame){

  if (!this.snake.length) { return []; }

  var tempSnake = [].concat(this.snake);
  var tempLength = this.length

  if (this.dir == 'NONE') {
    return tempSnake;
  }

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

  // if (!tempSnake[0]) { debugger; }

  return tempSnake;

};

Player.prototype.snakeHeadAtFrame = function(frame){

  return this.snakeAtFrame(frame)[0];

}

Player.prototype.die = function(playerInfo) {

  this.frame = playerInfo.frame;
  this.snake = playerInfo.snake;
  this.state = CONSTANTS.PLAYER_STATES.DEAD;
  this.dir = 'NONE';

};

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

module.exports = Player;
