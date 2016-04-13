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
    // _io.emit('event', {data: 'hi'})
  });

  var ids = _io.sockets.map(function(s){
    return s.id;
  })

  console.log(ids);

  _redisClient.hgetall('users data', function(err, users){
    _io.emit('event', users);
  });
  // _io.emit('event', {data: 'wohoo' });

};

exports.start = function(redisClient, io) {

  _redisClient = redisClient;
  _io = io;

  user1 = { username: 'me'   }
  user2 = { username: 'yhou' }

  userInfo = [
    {name: 'p1', email: 'email1'},
    {name: 'p2', email: 'email2'}
  ]

  console.log(JSON.stringify(userInfo));

  _redisClient.hset('users data', 'data', JSON.stringify(userInfo));

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
