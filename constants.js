exports.MS_PER_TICK = 100;
exports.NUMBER_DTS_TO_STORE = 10;
exports.MS_AFTER_EXPECTED_SERVER_UPDATE_ARRIVAL_TO_UPDATE_SCREEN = 12;

exports.APPLE_COUNT = 10;
exports.STARTING_SNAKE_LENGTH = 10;

exports.CANVAS_PADDING = 8;
exports.CANVAS_SHRINK_X = 0;
exports.CANVAS_SHRINK_Y = 5;

exports.PLAYER_STATES = {
  PLAYING: 1,
  PLACED:  2,
  DEAD:    3
}

exports.PLAYER_MOVES = {
  SET_STARTING_POS: 1,
  SET_DIRECTION: 2,
  DECLARE_DEATH: 3
}

exports.CELL_TYPES = {
  OWN_SNAKE: 1,
  OTHER_SNAKE: 2,
  APPLE: 3
}

exports.CELL_STYLES = {
  1: ' own-snake',
  2: ' other-snake',
  3: ' apple'
}

exports.DIRS = {
  N: [-1, 0],
  S: [ 1, 0],
  E: [ 0, 1],
  W: [ 0,-1]
}

exports.KEYS = {
  37: 'W', 38: 'N', 39: 'E', 40: 'S'
}

exports.OPPOSITE_DIRS = {
  W: 'E', E: 'W', N: 'S', S: 'N'
}

exports.BOARD = {
  WIDTH:  50,
  HEIGHT: 30
}

exports.ACTIONS = {
  SERVER_TICK: 1,
  UPDATE_SCREEN: 2
}
