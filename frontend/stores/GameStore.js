var Dispatcher = require('../Dispatcher');
var Store = require('flux/utils').Store;

var Player = require('../../util/Player');

var Actions = require('../actions');

var _lastServerTick, _updating;
var _time, _newTime, _dT, _dTAvg;
var _dTList = [];
var _dTSum = 0;
var _currentFrame;
var _currentState;

var _moveRequests = {};

var _playerId;
// var _lastServerTickFrame;

var GameStore = new Store(Dispatcher);

GameStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case CONSTANTS.ACTIONS.SERVER_TICK:
      GameStore.receiveServerTick(payload.serverGameState, payload.ownId);
      break;
    case CONSTANTS.ACTIONS.UPDATE_SCREEN:
      GameStore.updateScreen();
      break;
  }

};

GameStore.currentFrame = function(){ return _currentFrame; }
GameStore.currentState = function(){ return _currentState; }
GameStore.ownId = function() { return _playerId; }
GameStore.moveRequest = function(frame) { return _moveRequests[frame]; }
GameStore.delMoveRequest = function(frame) { delete _moveRequests[frame]; }
GameStore.setMoveRequest = function(frame, dir) { _moveRequests[frame] = dir; }

GameStore.receiveServerTick = function(serverGameState, ownId){

  if (!_playerId) { _playerId = ownId; }

  if (serverGameState.frameNumber > _currentFrame) {
  // if we are receiving data from the server about a frame
  // that we will show shortly, just copy the data from the server
  // into our game state store
    // console.log('goood');

  } else if (serverGameState.frameNumber == _currentFrame) {
  // otherwise, we had to predict what the board will look like
  // because this frame hadn't arrived yet - we may need to
  // update the screen immediately to fix discrepencies between
  // our predictions and the state of the board
    // console.log('baaad')
  } else if (_lastServerTick && serverGameState.frameNumber > _lastServerTick.frameNumber){
  // old data but still newer than the last tick received from the server

  }

  _lastServerTick = serverGameState;
  _lastServerTick.arrivalTime = new Date();

  GameStore.parseLastServerTick();
  GameStore.updateTimeStore();

  // see if we have to start our loop of updating
  // the actual screen
  if ( !_updating && _dTList.length == CONSTANTS.NUMBER_DTS_TO_STORE ) {

    // make first setTimeout call, calling updateScreen
    // which sets the update loop in motion
    _updating = true;

    // first frame that gets rendered actually ends up
    // being the next one
    _currentFrame = _lastServerTick.frameNumber;

    // timeline: top = server tick arrivals, bottom = screen updates
    // |-----|-----|-----|-----|--->
    //        |-----|-----|-----|-->
    var timeToNextUpdate = _dTAvg + CONSTANTS.MS_AFTER_EXPECTED_SERVER_UPDATE_ARRIVAL_TO_UPDATE_SCREEN;
    setTimeout(Actions.updateScreen, timeToNextUpdate);
  };

};

GameStore.parseLastServerTick = function(){

  Object.keys(_lastServerTick.players).forEach(function(id){
    _lastServerTick.players[id] = Player.fromJSON(_lastServerTick.players[id]);
  })


};

GameStore.updateScreen = function(){

  GameStore.delMoveRequest(_currentFrame);
  _currentFrame += 1;
  GameStore.setNewTimeout();

  if (GameStore.moveRequest(_currentFrame + 1)) {
    var nextFrame = _currentFrame + 1;
    Actions.requestDirChange(nextFrame, GameStore.moveRequest(nextFrame));
  };

  // debugger;

  if (_currentFrame == _lastServerTick.frameNumber) {

    _currentState = _lastServerTick;

  } else if (_currentState) {

    if (_moveRequests[_currentFrame]) {
      _currentState.players[GameStore.ownId()].dir = _moveRequests[_currentFrame];
    }

    GameStore.guessTick();

    console.log('server data arrived late');
    console.log('current showing frame: ' + _currentFrame);
    console.log('last server arrived  : ' + _lastServerTick.frameNumber);

  }

  GameStore.__emitChange();
};

GameStore.guessTick = function(){

  Object.keys(_currentState.players).forEach(function(player){
    _currentState.players[player].tick();
  });

};

GameStore.setNewTimeout = function(){

  // figure out what frame number we are currently scheduling
  var nextFrameNumber = _currentFrame + 1;

  // how many frames past the most recently arrived server tick
  // we are scheduling. optimally this will be 1, sometimes 2 if
  // the arrival of the last tick has been slightly delayed
  var i = nextFrameNumber - _lastServerTick.frameNumber

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

module.exports = GameStore;
