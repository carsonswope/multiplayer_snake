var Dispatcher = require('./Dispatcher');

var _socket;

exports.updateScreen = function(){
  Dispatcher.dispatch({
    actionType: CONSTANTS.ACTIONS.UPDATE_SCREEN
  });
};

exports.setupClientSocketEvents = function(socket){

  _socket = socket;

  socket.on(CONSTANTS.ACTIONS.SERVER_TICK, function(data){
    Dispatcher.dispatch({
      actionType: CONSTANTS.ACTIONS.SERVER_TICK,
      serverGameState: data,
      ownId: socket.id
    })
  });

};

exports.resizeWindow = function(){
  Dispatcher.dispatch({
    actionType: CONSTANTS.ACTIONS.RESIZE_WINDOW,
    size: {
      width:  innerWidth,
      height: innerHeight
    }
  })

};

exports.requestSpawnLocation = function(requestedLocation){
  _socket.emit(CONSTANTS.PLAYER_MOVES.SET_STARTING_POS, requestedLocation);
};
