var redis = require('redis');

var _time = new Date();
var _newTime, _dT, _dTAvg;
var _dTList = [];
var _dTSum = 0;
var _interval;
var _frameNumber = 0;
var _redisClient;
var _io;

exports.tick = function() {

  updateTime();

  _redisClient.hgetall('players', function(err, users){
    _io.emit(CONSTANTS.ACTIONS.SERVER_TICK,
      {
        users: users,
        frameNumber: _frameNumber,
        avgTickTime: _dTAvg
      }
    );
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
  _time = _newTime;

  _frameNumber += 1;
  _frameNumber = _frameNumber % CONSTANTS.NUM_FRAMES;
};
