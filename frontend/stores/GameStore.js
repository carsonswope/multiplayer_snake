var Dispatcher = require('../Dispatcher');
var Store = require('flux/utils').Store;
var Player = require('../../util/Player');
var MathUtil = require('../../util/MathUtil');
var Actions = require('../actions');

var _lastServerTick, _updating;
var _time, _newTime, _dT, _dTAvg;
var _dTList = [];
var _dTSum = 0;
var _currentFrame;
var _currentState = {
  players: {},
  apples: {},
  arrivalTime: new Date(),
  frameNumber: 0
};

var _moveRequests = {};
var _playerId;
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
GameStore.ownPlayer = function() {
  if (_currentState && _playerId) {return _currentState.players[_playerId]; }
}
GameStore.moveRequest = function(frame) { return _moveRequests[frame]; }
GameStore.delMoveRequest = function(frame) { delete _moveRequests[frame]; }
GameStore.setMoveRequest = function(frame, dir, snake) {
  _moveRequests[frame] = {dir: dir, snake: snake};

  GameStore.ownPlayer().snake = snake;
  GameStore.ownPlayer().dir = dir;
  GameStore.ownPlayer().frame = frame;

}

GameStore.receiveServerTick = function(serverGameState, ownId){

  if (!_playerId) { _playerId = ownId; }

  if (!_lastServerTick || _lastServerTick.frameNumber < serverGameState.frameNumber ) {

    _lastServerTick = serverGameState;
    _lastServerTick.arrivalTime = new Date();
    GameStore.parseLastServerTick();
    _currentState = _lastServerTick;

  }

  GameStore.updateTimeStore();
  GameStore.initiateUpdateLoopIfNecessary()

};

GameStore.ownIdAndWantToOverride = function(id) {

  // basically, if the client player has made any
  // moves within 1 frame of the current frame,
  // we will override the information from the
  // server because it might not be updated yet

  return (id == _playerId &&
          (_moveRequests[_currentFrame] ||
           _moveRequests[_currentFrame + 1] ||
           _moveRequests[_currentFrame - 1]));
}

GameStore.initiateUpdateLoopIfNecessary = function(){

  // see if we have to initially start our loop of updating
  // the actual screen - called after we get 10(or whatever) ticks!
  if ( !_updating && _dTList.length == CONSTANTS.NUMBER_DTS_TO_STORE ) {
    _updating = true;

    // first frame that gets rendered actually ends up
    // being the next one
    _currentFrame = _lastServerTick.frameNumber;
    _currentState = _lastServerTick;

    // timeline: top = server tick arrivals, bottom = screen updates
    // |-----|-----|-----|-----|--->
    //        |-----|-----|-----|-->
    var timeToNextUpdate = _dTAvg + CONSTANTS.MS_AFTER_EXPECTED_SERVER_UPDATE_ARRIVAL_TO_UPDATE_SCREEN;
    setTimeout(Actions.updateScreen, timeToNextUpdate);
  };

}

GameStore.parseLastServerTick = function(){

  Object.keys(_lastServerTick.players).forEach(function(id){

    // if the id is our own id, and we made a move
    // recently, we ignore where the server says we
    // should be and instead just copy our state as
    // we have calculated it into the last server
    // tick

    if (GameStore.ownIdAndWantToOverride(id)) {
      _lastServerTick.players[id] = GameStore.ownPlayer();
    } else {
      _lastServerTick.players[id] = Player.fromJSON(_lastServerTick.players[id]);
    }

  })
};

GameStore.updateScreen = function(){
  GameStore.delMoveRequest(_currentFrame - 2);
  _currentFrame += 1;
  GameStore.setNewTimeout();
  GameStore.__emitChange();
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
