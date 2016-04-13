var Dispatcher = require('../Dispatcher');
var Store = require('flux/utils').Store;

var Actions = require('../actions');

var _lastServerTick;
var _time, _newTime, _dT, _dTAvg;
var _dTList = [];
var _dTSum = 0;

var _currentFrame;
var _lastServerTickFrame;

var _localUpdating = false;
var _timeToNextUpdate;

var GameStore = new Store(Dispatcher);

GameStore.receiveServerTick = function(gameState){

  _lastServerTick = gameState;
  _lastServerTick.arrivalTime = new Date();
  GameStore.updateTimeStore();

  if ( !_localUpdating && _dTList.length == CONSTANTS.NUMBER_DTS_TO_STORE ) {

    // make first setTimeout call, calling updateScreen
    // which sets the update loop in motion
    console.log('started update');
    _localUpdating = true;
    _currentFrame = _lastServerTick.frameNumber;
    _timeToNextUpdate = _dTAvg + CONSTANTS.MS_AFTER_EXPECTED_SERVER_UPDATE_ARRIVAL_TO_UPDATE_SCREEN;
    setTimeout(Actions.updateScreen, _timeToNextUpdate);
  };

};

GameStore.updateScreen = function(){

  console.log('update');
  _currentFrame += 1;
  _currentFrame = _currentFrame % CONSTANTS.NUM_FRAMES;
  GameStore.setNewTimeout();

  // debugger

  if (_currentFrame == _lastServerTick.frameNumber) {

    console.log('server data arrived in time');
    console.log('current: ' + _currentFrame);

  } else {

    console.log('server data arrived late');
    console.log('current showing frame: ' + _currentFrame);
    console.log('last server arrived  : ' + _lastServerTick.frameNumber);

  }

  GameStore.__emitChange();
};

GameStore.setNewTimeout = function(){

  // figure out what frame number we are currently scheduling
  var nextFrameNumber = (_currentFrame + 1) % CONSTANTS.NUM_FRAMES;

  // im sure theres some easy discrete math solution to this problem
  // how many frames past the most recently arrived server tick
  // we are scheduling. optimally this will be 1, sometimes 2 if
  // the last tick is slightly delayed
  var i = 0
  while ((_lastServerTick.frameNumber + i) % CONSTANTS.NUM_FRAMES != nextFrameNumber) {
    i += 1;
  }

  // expected arrival time of that frame from the server,
  // plus buffer
  // minus current time
  // gives us the timeout length we wants
  var expectedArrivalTime = _lastServerTick.arrivalTime.getTime() + (i * _dTAvg);
  var newUpdateTime = expectedArrivalTime + CONSTANTS.MS_AFTER_EXPECTED_SERVER_UPDATE_ARRIVAL_TO_UPDATE_SCREEN;

  setTimeout(Actions.updateScreen, newUpdateTime - new Date());

};

GameStore.updateTimeStore = function() {

  if (_time) {
    _newTime = new Date();
    _dT = _newTime - _time;
    _dTSum += _dT;
    _dTList.push(_dT);

    if (_dTList.length > CONSTANTS.NUMBER_DTS_TO_STORE) {
      _dTSum -= _dTList.shift();
    }

    _dTAvg = _dTSum / _dTList.length;
    _time = _newTime;
  } else {
    _time = new Date();
  }
};

GameStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case CONSTANTS.ACTIONS.SERVER_TICK:
      GameStore.receiveServerTick(payload.gameState);
      break;
    case CONSTANTS.ACTIONS.UPDATE_SCREEN:
      GameStore.updateScreen();
      break;
  }

};

module.exports = GameStore;
