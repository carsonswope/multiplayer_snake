var Dispatcher = require('../Dispatcher');
var Store = require('flux/utils').Store;

var _size = {
  width: innerWidth,
  height: innerHeight
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
  _size = size;
  WindowStore.__emitChange();
}

module.exports = WindowStore;
