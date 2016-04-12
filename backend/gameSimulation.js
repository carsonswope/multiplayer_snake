var CONSTANTS = require('./constants/Constants')

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
  _redisClient.set('frame number', _frameNumber)
  console.log('observed: ' + _dT + ' last avg: ' + _dTAvg);
  // console.log(_frameNumber);
  _redisClient.get('frame number', function(err, reply){
    // console.log('eer: ' + err);
    _io.emit('event', {data: reply})
  });

  // _io.emit('event', {data: 'wohoo' });

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
