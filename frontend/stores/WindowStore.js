var Dispatcher = require('../Dispatcher');
var Store = require('flux/utils').Store;

var CONSTANTS = require('../../constants.js');

var _size = {
  width: innerWidth - CONSTANTS.CANVAS_SHRINK_X,
  height: innerHeight - CONSTANTS.CANVAS_SHRINK_Y
};

var WindowStore = new Store(Dispatcher);

WindowStore.__onDispatch = function(payload) {
  switch (payload.actionType) {
    case CONSTANTS.ACTIONS.RESIZE_WINDOW:
      WindowStore.resizeWindow(payload.size);
      break;
  }
};

WindowStore.size = function() { return _size; }

WindowStore.resizeWindow = function(size) {
  _size = {
    width: size.width - CONSTANTS.CANVAS_SHRINK_X,
    height: size.height - CONSTANTS.CANVAS_SHRINK_Y
  };
  WindowStore.__emitChange();
}

module.exports = WindowStore;
