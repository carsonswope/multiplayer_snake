function Player(options){
  this.id =     options.id    || id;
  this.name =   options.name  || undefined;
  this.snake =  options.snake || [];
  this.state =  options.state || CONSTANTS.PLAYER_STATES.DEAD;
  this.dir =    options.dir   || undefined;
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
  console.log(newPos);
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
  if (this.dir) {
    var dPos = CONSTANTS.DIRS[this.dir];
    return ([
      this.snake[0][0] + dPos[0],
      this.snake[0][1] + dPos[1]
    ]);
  } else {
    return undefined;
  }
};

Player.prototype.tick = function(ateApple){
  if (this.nextPos()){
    this.snake.unshift(this.nextPos());
  }

  // if (!ateApple) { this.snake.pop(); }

};

Player.rewindOneFrameWithNewDirection = function(newDir){
  this.dir = newDir;
  this.snake.shift();
  this.tick();
};

module.exports = Player;
