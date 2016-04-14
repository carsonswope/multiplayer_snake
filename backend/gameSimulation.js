var redis = require('redis');

var Player = require('../util/Player');

var _time = new Date();
var _newTime, _dTAvg, _dT;
var _dTList = [];
var _dTSum = 0;
var _interval;

global._serverDTAvg;
global._frameNumber = 0;
global._lastFrameTime;
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
          avgTickTime: _dTAvg
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
  _newTime = new Date();
  _dT = _newTime - _time;
  _dTSum += _dT;
  _dTList.push(_dT);

  if (_dTList.length > CONSTANTS.NUMBER_DTS_TO_STORE) {
    _dTSum -= _dTList.shift();
  }

  _dTAvg = _dTSum / _dTList.length;
  _serverDTAvg = _dTAvg;
  _time = _newTime;

  _frameNumber += 1;
  _lastFrameTime = new Date();
};
