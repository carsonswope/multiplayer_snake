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

  var allPositions = {};

  Object.keys(players).forEach(function(player){
    currentPlayer = Player.fromJSON(players[player]);
    snake = currentPlayer.snakeAtFrame(frame);
    snake.slice(1).forEach(function(seg){
      segStr = '' + seg[0] + ',' + seg[1];
      allPositions[segStr] = player;
    });
  })

  Object.keys(players).forEach(function(player){
    currentPlayer = Player.fromJSON(players[player]);

    if (currentPlayer.length){

      if (currentPlayer.action == 'DIE') {
        currentPlayer.dir = undefined;
        // currentPlayer.length = 2;
        // console.log('reset');
        // currentPlayer.snake = [];
        // currentPlayer.snake = currentPlayer.snakeAtFrame(frame + 2);
        currentPlayer.state = CONSTANTS.PLAYER_STATES.DEAD;
      }

      currentPlayer.action = undefined;

      head = currentPlayer.snakeHeadAtFrame(frame);

      if (head) {
        headStr = '' + head[0] + ',' + head[1];



        if (apples[headStr]) {
          currentPlayer.length += 1;

          currentPlayer.action = 'GROW';

          delete apples[headStr];
          var newPos = MathUtil.randomPosStr(
            CONSTANTS.BOARD.HEIGHT,
            CONSTANTS.BOARD.WIDTH
          );

          apples[newPos] = true;


        }

        if (allPositions[headStr]) {
          currentPlayer.action = 'DIE';
          currentPlayer.dir = undefined;
          currentPlayer.snake = currentPlayer.snakeAtFrame(frame)
          currentPlayer.state = CONSTANTS.PLAYER_STATES.DEAD;
          // currentPlayer.state = CONSTANTS.PLAYER_STATES.DEAD;

        } else if (head[0] < 0 || head[0] >= CONSTANTS.BOARD.HEIGHT ||
                   head[1] < 0 || head[1] >= CONSTANTS.BOARD.WIDTH){
          currentPlayer.action = 'DIE';
          currentPlayer.dir = undefined;
          currentPlayer.snake = currentPlayer.snakeAtFrame(frame)
          currentPlayer.state = CONSTANTS.PLAYER_STATES.DEAD;
          // currentPlayer.state = CONSTANTS.PLAYER_STATES.DEAD;


        }

      }

      _redisClient.hset('players', player, currentPlayer.json() );


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
