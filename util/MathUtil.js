exports.stepsAway = function(pos1, pos2) {
  return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
};

exports.posSum = function(pos1, pos2) {

  return ([
    pos1[0] + pos2[0], pos1[1] + pos2[1]
  ]);
}

exports.random = function(max) {

  return Math.floor(Math.random() * max);

}
