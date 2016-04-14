var redis = require('redis');

var Player = require('../util/Player');

var _interval;
var _frameNumber = 0;
var _lastFrameTime;
var _redisClient, _io;

exports.tick = function() {

  updateTime();

  _redisClient.hgetall('players', function(err, players){
    if (!err){
      exports.advanceGameState(players);
      _io.emit(CONSTANTS.ACTIONS.SERVER_TICK,
        {
          players: players,
          frameNumber: _frameNumber,
        }
      );
    }
  });
};

exports.advanceGameState = function(players) {
  if (!players) { return; }

  var currentPlayer;
  
  Object.keys(players).forEach(function(player){
    currentPlayer = Player.fromJSON(players[player]);
    currentPlayer.tick();
    _redisClient.hset('players', player, currentPlayer.json());
  });

};

exports.start = function(redisClient, io) {
  _redisClient = redisClient;
  _io = io;
  _interval = setInterval(exports.tick, CONSTANTS.MS_PER_TICK);

};

exports.stop = function() {
  clearInterval(_interval);
};

var updateTime = function() {
  _frameNumber += 1;
  _lastFrameTime = new Date();
};
