var redis = require('redis');

var Player = require('../util/Player');
var MathUtil = require('../util/MathUtil');

var CONSTANTS = require('../constants');

var _interval;
var _frameNumber = 0;
var _lastFrameTime;
var _redisClient, _io;

var apples = {};
var appleCount = 5;

for (var i = 0; i < appleCount; i++) {

  var randomPos = MathUtil.randomPos(
    CONSTANTS.BOARD.HEIGHT,
    CONSTANTS.BOARD.WIDTH
  )

  apples['' + randomPos[0] + ',' + randomPos[1]] = true;

};

exports.tick = function() {

  updateTime();

  _redisClient.hgetall('players', function(err, players){
    if (!err){

      exports.checkCurrentGameState(players, apples, _frameNumber - 1);

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

exports.checkCurrentGameState = function(players, apples, frame) {

  if (!players) {return; }

  var head;

  Object.keys(players).forEach(function(player){
    currentPlayer = Player.fromJSON(players[player]);

    if (currentPlayer.length){

      head = currentPlayer.snakeHeadAtFrame(frame);
      if (head && apples['' + head[0] + ',' + head[1]]) {
        currentPlayer.length += 1;
        delete apples['' + head[0] + ',' + head[1]];
        var newPos = MathUtil.randomPosStr(
          CONSTANTS.BOARD.HEIGHT,
          CONSTANTS.BOARD.WIDTH
        );

        console.log(newPos);

        apples[newPos] = true;

        _redisClient.hset('players', player, currentPlayer.json() );

      }

    }

  });

}

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
  _redisClient.hset('time', 'frameNumber', _frameNumber );
  _redisClient.hset('time', 'lastFrameTime', _lastFrameTime );
};
