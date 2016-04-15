exports.stepsAway = function(pos1, pos2) {
  return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
};

exports.posSum = function(pos1, pos2) {

  return ([
    pos1[0] + pos2[0], pos1[1] + pos2[1]
  ]);
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

exports.randomPosStr = function(rows, cols) {

  return exports.posToStr(exports.randomPos(rows,cols));

}

exports.posToStr = function(pos) {

  return '' + pos[0] + ',' + pos[1];
}

exports.posDif = function(pos1, pos2) {
  return ([
    pos2[0] - pos1[0], pos2[1] - pos1[1]
  ]);
};
