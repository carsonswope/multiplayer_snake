var redis = require('redis');

var Player = require('../util/Player');
var MathUtil = require('../util/MathUtil');

var CONSTANTS = require('../constants');

var _interval;
var _frameNumber = 0;
var _lastFrameTime;
var _redisClient, _io;

var apples = [];
var appleCount = 5;

for (var i = 0; i < appleCount; i++) {
  apples.push([
    MathUtil.random(CONSTANTS.BOARD.HEIGHT),
    MathUtil.random(CONSTANTS.BOARD.WIDTH)
  ]);
}

exports.tick = function() {

  if (apples.length < appleCount) {
    apples.push([
      MathUtil.random(CONSTANTS.BOARD.HEIGHT),
      MathUtil.random(CONSTANTS.BOARD.WIDTH)
    ]);
  }

  updateTime();

  _redisClient.hgetall('players', function(err, players){
    if (!err){
      exports.advanceGameState(players);
      _io.emit(CONSTANTS.ACTIONS.SERVER_TICK,
        {
          players: players,
          frameNumber: _frameNumber,
          apples: apples
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
    currentPlayer.tick(apples, exports.resetApple);
    _redisClient.hset('players', player, currentPlayer.json());
  });

};

exports.resetApple = function(idx) {

  apples[idx] = [
    MathUtil.random(CONSTANTS.BOARD.HEIGHT),
    MathUtil.random(CONSTANTS.BOARD.WIDTH)
  ];

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
