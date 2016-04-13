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

// Player.prototype.tick = function(ateApple){
//   var dPos = CONSTANTS.DIRS[this.dir];
//   snake.unshift([
//     this.snake[0] + dPos[0],
//     this.snake[1] + dPos[1]
//   ])
//
//   if (!ateApple) { this.snake.pop(); }
//
// };

module.exports = Player;
