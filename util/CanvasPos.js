var padding = CONSTANTS.CANVAS_PADDING;
var rows = CONSTANTS.BOARD.HEIGHT;
var cols = CONSTANTS.BOARD.WIDTH;

var getScreen = function(screenSize) {
  return {
    height: screenSize.height - padding,
    width: screenSize.width - padding
  };
}

var squareSideLength = function(screenSize) {

  var screen = getScreen(screenSize);
  return (screen.height / screen.width > rows / cols) ?
    screen.width / cols : screen.height / rows;
}

exports.getOffset = function(screen, squareSize) {
  return [
    (screen.height - (squareSize * rows)) / 2,
    (screen.width -  (squareSize * cols)) / 2
  ];
}

exports.coords = function(pos, screenSize) {

  var squareSize = squareSideLength(screenSize);
  var screen = getScreen(screenSize);
  var offset = exports.getOffset(screen, squareSize);

  console.log([
    Math.floor(((pos[1] - (padding + offset[0])) / squareSize)),
    Math.floor(((pos[0] - (padding + offset[1])) / squareSize))
  ]);

  var realPos = [
    Math.floor(((pos[1] - (padding + offset[0])) / squareSize)),
    Math.floor(((pos[0] - (padding + offset[1])) / squareSize))
  ]

  if (realPos[0] == -0 ) { realPos[0] = 0; }
  if (realPos[1] == -0 ) { realPos[1] = 0; }

  return realPos;


};

exports.screenPos = function(pos, screenSize) {

  var screen = getScreen(screenSize);
  var squareSize = squareSideLength(screen);
  var offset = exports.getOffset(screen, squareSize);

  var center = [
    (padding / 2) + offset[1] + ((pos[1] + 0.5) * squareSize),
    (padding / 2) + offset[0] + ((pos[0] + 0.5) * squareSize)
  ];

  return { pos: center, squareSize: squareSize };

};
