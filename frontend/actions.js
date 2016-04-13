var Dispatcher = require('./Dispatcher');

exports.serverTick = function(data){
  Dispatcher.dispatch({
    actionType: CONSTANTS.ACTIONS.SERVER_TICK,
    gameState: data
  });
};

exports.updateScreen = function(){
  Dispatcher.dispatch({
    actionType: CONSTANTS.ACTIONS.UPDATE_SCREEN
  });
}
