var React = require('react');
var PropTypes = React.PropTypes;

var Actions = require('../actions');

var MathUtil = require('../../util/MathUtil');

var WindowStore = require('../stores/WindowStore');
var GameStore = require('../stores/GameStore');

var Board = React.createClass({

  getInitialState: function() {

    return ({
       size: WindowStore.size(),
       gameState: GameStore.currentState(),
       ownId: GameStore.ownId()
     });
  },

  componentDidMount: function() {
    this.windowListener = WindowStore.addListener(this.resizeWindow);
    this.gameListener = GameStore.addListener(this.gameUpdate);
    window.addEventListener('keydown', this.handleKey);
  },

  componentWillUnmount: function() {
    this.windowListener.remove();
    this.gameListener.remove();
    window.removeEventListener('keydown', this.handleKey);
  },

  resizeWindow: function() {
    this.setState({
      size: WindowStore.size()
    });
  },

  gameUpdate: function() {
    this.setState({
      gameState: GameStore.currentState(),
      ownId: GameStore.ownId(),
      currentFrame: GameStore.currentFrame()
    });
  },

  ownPlayer: function() {
    if (this.state.gameState) { return this.state.gameState.players[this.state.ownId] }
  },

  ownPlayerState: function() {
    if (this.ownPlayer()) { return this.ownPlayer().state; }
  },

  handleClick: function(e) {
    if (this.ownPlayerState() == CONSTANTS.PLAYER_STATES.DEAD){
      var requestedSpawnLocation =
        e.target.id.split(',').map(function(coord){
          return parseInt(coord);
        });
      Actions.requestSpawnLocation(requestedSpawnLocation);
    }
  },

  eligibleMove: function(currentDir, testDir) {

    return (
      currentDir != testDir &&
      CONSTANTS.OPPOSITE_DIRS[currentDir] != testDir
    )

  },

  handleKey: function(e) {

    if (!this.ownPlayer() ||
        this.ownPlayerState() === CONSTANTS.PLAYER_STATES.DEAD ||
        !CONSTANTS.KEYS[e.which]) { return; }

    var reqDir = CONSTANTS.KEYS[e.which];
    var frame = this.state.currentFrame;
    var player = this.ownPlayer();

    if (!GameStore.moveRequest(frame)) {
      if (this.eligibleMove(player.dir, reqDir)) {
        GameStore.setMoveRequest(frame, reqDir, player.snake);
        Actions.requestDirChange(frame, reqDir, player.snake);
      }
    } else if (!GameStore.moveRequest(frame + 1)) {

      if (this.eligibleMove(GameStore.moveRequest(frame).dir, reqDir)) {

        var newHead = MathUtil.posSum(
          player.snake[0],
          CONSTANTS.DIRS[GameStore.moveRequest(frame).dir]
        );

        var newSnake = [newHead].concat(player.snake);
        if (newSnake.length > 10) { newSnake = newSnake.slice(0, -1); }

        GameStore.setMoveRequest(frame + 1, reqDir, newSnake);

      }

    }


  },

  boardDims: function() {
    CONSTANTS.BOARD.WIDTH
    CONSTANTS.BOARD.HEIGHT
    var height = this.state.size.height - (70 + CONSTANTS.BOARD.HEIGHT * 2);
    var width =  this.state.size.width - (20 + CONSTANTS.BOARD.WIDTH * 2);


    return { height: height, width: width }
  },

  squareSize: function() {

    var dims = this.boardDims();
    var squareSize;

    if (dims.height / dims.width > CONSTANTS.BOARD.HEIGHT / CONSTANTS.BOARD.WIDTH) {
      squareSize = dims.width / CONSTANTS.BOARD.WIDTH;
    } else {
      squareSize = dims.height / CONSTANTS.BOARD.HEIGHT;
    }

    return squareSize;

  },

  positions: function() {
    var positions = {}
    var segId;

    if (this.state.gameState) {
      Object.keys(this.state.gameState.players).forEach(function(id){
        this.state.gameState.players[id].snake.forEach(function(seg){
          segId = '' + seg[0] + ',' + seg[1];

          if (id == this.state.ownId) {
            positions[segId] = CONSTANTS.CELL_TYPES.OWN_SNAKE;
          } else {
            positions[segId] = CONSTANTS.CELL_TYPES.OTHER_SNAKE;
          }

        }.bind(this) );
      }.bind(this) );
    }

    return positions;
  },

  cells: function() {

    var positions = this.positions();
    var squareSize = this.squareSize();

    var rows = [];
    var cellId, cellClass;

    for (var row = 0; row < CONSTANTS.BOARD.HEIGHT; row++) {
      for (var col = 0; col < CONSTANTS.BOARD.WIDTH; col++) {
        cellId = '' + row + ',' + col;
        cellClass = 'cell';

        if (positions[cellId]) {
          cellClass += CONSTANTS.CELL_STYLES[positions[cellId]];
        };

        rows.push(
          <div id={cellId}
            className={cellClass}
            key={cellId}
            style={{
              width: squareSize,
              height: squareSize
            }}/>
        );

      }

    }

    return rows;


  },

  render: function() {

    return (
      <div id='board-main'
        onClick={this.handleClick}
        style={{
          width: (this.squareSize() + 2) * CONSTANTS.BOARD.WIDTH + 2
        }}>
        {this.cells()}
      </div>
    );
  }

});

module.exports = Board;
