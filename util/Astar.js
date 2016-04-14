var CONSTANTS = require('../constants');
var PQueue = require('js-priority-queue');

var isSamePos = function(pos1, pos2) {
  return (
    pos1[0] == pos2[0] && pos1[1] == pos2[1]
  );
};

function Node(pos, goal, parent) {
  this.pos = pos;
  this.parent = parent;
  this.goal = goal;
  this.toEnd = -1;
  this.fromStart = -1;
};

Node.prototype.stepsFromStart = function(){
  if (this.fromStart < 0) {
    if (!this.parent) {
      this.fromStart = 0;
    } else {
      this.fromStart = 1 + this.parent.stepsFromStart();
    }
  }
  return this.fromStart;
};

Node.prototype.estStepsToEnd = function(){
  if (this.toEnd < 0) {
    this.toEnd = Math.abs(this.pos[0] - this.goal[0]) + Math.abs(this.pos[1] - this.goal[1]);
  }
  return this.toEnd;
};

Node.prototype.estCost = function(){
  // console.log(this);
  // console.log(this.stepsFromStart());
  // console.log(this.estStepsToEnd());
  return this.stepsFromStart() + this.estStepsToEnd();
};

Node.prototype.isGoal = function(){
  return isSamePos(this.pos, this.goal);
};

Node.prototype.posStr = function(){
  return '' + this.pos[0] + ',' + this.pos[1];

};

Node.prototype.children = function() {
  var dPos;
  var newPos;
  var kids = []
  Object.keys(CONSTANTS.DIRS).forEach(function(dir){
    dPos = CONSTANTS.DIRS[dir];
    newPos = [
      this.pos[0] + dPos[0],
      this.pos[1] + dPos[1]
    ];

    kids.push(
      new Node(newPos, this.goal, this)
    )

  }.bind(this))

  return kids;
}

exports.minSteps = function(pos1, pos2) {

  var compareCost = function(n1, n2){
    return n1.estCost() - n2.estCost(); }

  var visitedNodes = {};
  var noticedNodes = {};
  var frontier = new PQueue({comparator: compareCost})
  var currentNode;

  frontier.queue( new Node(pos1, pos2) )

  while (frontier.length) {
    currentNode = frontier.dequeue();
    if (currentNode.isGoal()){ return currentNode.stepsFromStart(); }
    if (visitedNodes[currentNode.posStr()]) { continue; }
    visitedNodes[currentNode.posStr()] = true;

    currentNode.children().forEach(function(kid){
      if (kid.posStr() != currentNode.posStr()
          && !noticedNodes[kid.posStr()]) {
        noticedNodes[kid.posStr()] = true;
        frontier.queue(kid);
      }
    }.bind(this))

  }

};
