var CONSTANTS = require('./constants/Constants')

var _time = new Date();
var _dT;
var _interval;
var _stillGoing = false;

var _dTList = [];
var _dTSum = 0;

exports.tick = function() {

  _new_time = new Date();
  _dT = _new_time - _time;

  _dTSum += _dT;
  _dTList.push(_dT)
  if (_dTList.length > CONSTANTS.NUMBER_DTS_TO_STORE) {
    _dTSum -= _dTList.shift();
  }

  console.log('observed: ' + _dT + ' last avg: ' + _dTSum / _dTList.length);


  _time = _new_time;

};

exports.start = function() {
  _stillGoing = true;
  _interval = setInterval(exports.tick, CONSTANTS.MS_PER_TICK);
};

exports.stop = function() {
  clearInterval(_interval);
};
