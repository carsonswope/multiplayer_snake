var redis = require('redis');
var Player = require('../util/Player');
var MathUtil = require('../util/MathUtil');
var CONSTANTS = require('../constants');

var _interval, _redisClient, _io;

exports.tick = function() {

  _redisClient.hincrby('time', 'frameNumber', 1 );

  _redisClient.hget('time', 'frameNumber', function(err, frameNumber){
    _redisClient.hgetall('apples', function(err, apples){
      _redisClient.hgetall('players', function(err, players){
        if (!err){
          exports.checkCurrentGameState(players, apples, parseInt(frameNumber) - 1);
          _io.emit(CONSTANTS.ACTIONS.SERVER_TICK,
            {
              players: players,
              frameNumber: parseInt(frameNumber),
              apples: apples
            }
          );
        }
      });
    });
  });
};

exports.checkCurrentGameState = function(players, apples, frame) {

  if (!players) {return; }
  var head, allPositions = {};

  Object.keys(players).forEach(function(player){

    currentPlayer = Player.fromJSON(players[player]);
    snake = currentPlayer.snakeAtFrame(frame);

    snake.forEach(function(seg){
      segStr = MathUtil.posStr(seg);
      allPositions[segStr] = allPositions[segStr] || [];
      allPositions[segStr].push(player);
    });

  })

  Object.keys(players).forEach(function(player){
    currentPlayer = Player.fromJSON(players[player]);

    if (currentPlayer.state == CONSTANTS.PLAYER_STATES.DEAD) {
      currentPlayer.dir = 'NONE';
      currentPlayer.snake = [];

      _redisClient.hset('players', player, currentPlayer.json() );

    } else if (currentPlayer.length) {

      currentPlayer.action = undefined;
      head = currentPlayer.snakeHeadAtFrame(frame);
      if (head) {
        var headStr = MathUtil.posStr(head);

        if (apples[headStr]) {
          currentPlayer.length += 1;
          _redisClient.hdel('apples', headStr);
          _redisClient.hset('apples', MathUtil.randomPosStr(), true);
        }

        // if (allPositions[headStr].length > 1 || MathUtil.outOfBounds(head)) {
        //   currentPlayer.action = 'DIE';
        //   currentPlayer.snake = currentPlayer.snakeAtFrame(frame);
        //   currentPlayer.dir = 'NONE';
        //   currentPlayer.state = CONSTANTS.PLAYER_STATES.DEAD;
        // }
      }

      _redisClient.hset('players', player, currentPlayer.json() );
    }
  });
}

exports.start = function(redisClient, io) {
  _redisClient = redisClient;
  _io = io;
  initializeApples();
  _interval = setInterval(exports.tick, CONSTANTS.MS_PER_TICK);
  _redisClient.hset('time', 'frameNumber', 0);

  console.log('server running on port: ' + process.env.PORT);
  console.log('connected to redis at:  ' + process.env.REDIS_URL);
};

exports.stop = function() { clearInterval(_interval); };

var initializeApples = function() {
  for (var i = 0; i < CONSTANTS.APPLE_COUNT; i++) {
    _redisClient.hset('apples', MathUtil.randomPosStr(), true);
  };
};
