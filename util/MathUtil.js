var CONSTANTS = require('../constants');

exports.stepsAway = function(pos1, pos2) {
  return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
};

exports.posSum = function(pos1, pos2) {

  if (pos1 && pos2) {
    return ([
      pos1[0] + pos2[0], pos1[1] + pos2[1]
    ]);
  } else {
    console.log('error in posSum');
  }

};

exports.random = function(max) {

  return Math.floor(Math.random() * max);

};

exports.randomPos = function(rows, cols) {
  return ([
    exports.random(rows),
    exports.random(cols)
  ]);
}

exports.posParse = function(posStr) {
  return posStr.split(',').map(function(el){
    return parseInt(el);
  });

}

exports.randomPosStr = function() {

  return exports.posStr(
    exports.randomPos(
      CONSTANTS.BOARD.HEIGHT,
      CONSTANTS.BOARD.WIDTH
    ));
};

exports.posStr = function(pos) {

  return '' + pos[0] + ',' + pos[1];
}

exports.neighborPosStrs = function(posStr) {

  var strs = [];
  var parsedPos = exports.posParse(posStr);

  for (var i = 0; i < 9; i++) {
    if (i != 4){
      strs.push(
        exports.posStr([
          parsedPos[0] - 1 + Math.floor(i / 3),
          parsedPos[1] - 1 + (i % 3)
        ])
      );
    }
  }

  return strs;


}

exports.posDif = function(pos1, pos2) {
  if (pos1 && pos2) {
    return ([
      pos2[0] - pos1[0], pos2[1] - pos1[1]
    ]);
  } else {
    console.log('error in posDif');
  }
};

exports.outOfBounds = function(pos) {
  return pos[0] < 0 || pos[0] >= CONSTANTS.BOARD.HEIGHT ||
         pos[1] < 0 || pos[1] >= CONSTANTS.BOARD.WIDTH;
}
