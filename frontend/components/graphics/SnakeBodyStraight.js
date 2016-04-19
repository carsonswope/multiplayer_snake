var CanvasHelper = require('../../../util/CanvasPos');
var RenderableComponent = require('./RenderableComponent');

var NUMBER_POINTS = 10;
var MAGNITUDE = 2;
var LINE_WIDTH = 2;

function SnakeBodyStraight(originalPosition, screenSize, dir, idx) {
  this.dir = dir
  this.idx = idx;
  RenderableComponent.call(this, originalPosition, screenSize);
}

SnakeBodyStraight.inherits(RenderableComponent);

SnakeBodyStraight.prototype.els = function(framePoint) {

  return [{
    points: [[-1,-1], [-1,1], [1,1], [1,-1]],
    fill: '#00FF26'
  },{
    points: [[-1,-1], [-1,1]],
    width: 4,
    stroke: '#1DB835'
  },{
    points: [[1,-1], [1,1]],
    width: 4,
    stroke: '#1DB835'
  }];


};

SnakeBodyStraight.prototype.draw = function(ctx, framePoint) {

  if (this.dir[0] == 0) {
    this.rotation = Math.PI / 2;
  } else {
    this.rotation = 0;
  }

  if (this.justAte) {
    this.scale = 1 + (0.5 * Math.sin(framePoint * Math.PI));
  } else {
    this.scale = 1;
  }

  this.toScreen(ctx, framePoint);

};

module.exports = SnakeBodyStraight;
