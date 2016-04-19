var CanvasHelper = require('../../../util/CanvasPos');
var RenderableComponent = require('./RenderableComponent');
var COLORS = require('../../../colors.js')

var NUMBER_POINTS = 10;
var MAGNITUDE = 2;
var LINE_WIDTH = 2;

function SnakeBodyStraight(originalPosition, screenSize, dir) {
  this.dir = dir
  RenderableComponent.call(this, originalPosition, screenSize);
}

SnakeBodyStraight.inherits(RenderableComponent);

SnakeBodyStraight.prototype.els = function(framePoint) {

  var fillColor = this.ownPlayer ?
    COLORS.OWN_PLAYER_SNAKE_BODY : COLORS.OTHER_PLAYER_SNAKE_BODY;
  var strokeColor = this.ownPlayer ?
    COLORS.OWN_PLAYER_SNAKE_OUTLINE : COLORS.OTHER_PLAYER_SNAKE_OUTLINE;

  return [{
    points: [[-1,-1], [-1,1], [1,1], [1,-1]],
    fill: fillColor
  },{
    points: [[-1,-1], [-1,1]],
    width: 4,
    stroke: strokeColor
  },{
    points: [[1,-1], [1,1]],
    width: 4,
    stroke: strokeColor
  }];


};

SnakeBodyStraight.prototype.draw = function(ctx, framePoint, dY) {

  if (this.dir[0] == 0) {
    this.rotation = Math.PI / 2;
  } else {
    this.rotation = 0;
  }

  if (this.justAte) {
    this.scale = 1.3 + (0.5 * Math.sin(framePoint * Math.PI));
  } else {
    this.scale = 1;
  }

  this.toScreen(ctx, framePoint, dY);

};

module.exports = SnakeBodyStraight;
