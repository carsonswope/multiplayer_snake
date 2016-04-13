exports.MS_PER_TICK = 350;
exports.NUMBER_DTS_TO_STORE = 10;
exports.NUM_FRAMES = 255;
exports.MS_AFTER_EXPECTED_SERVER_UPDATE_ARRIVAL_TO_UPDATE_SCREEN = 10;

exports.PLAYER_STATES = {
  PLAYING: 1,
  PLACED:  2,
  DEAD:    3
}

exports.PLAYER_MOVES = {
  SET_STARTING_POS: 1,
  SET_DIRECTION: 2
}

exports.DIRS = {
  N: [-1, 0],
  S: [ 1, 0],
  E: [ 0, 1],
  W: [ 0,-1]
}

exports.BOARD = {
  WIDTH:  50,
  HEIGHT: 50
}

exports.ACTIONS = {
  SERVER_TICK: 1,
  UPDATE_SCREEN: 2
}
