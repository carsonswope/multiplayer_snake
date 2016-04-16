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
    return  currentDir != testDir &&
            CONSTANTS.OPPOSITE_DIRS[currentDir] != testDir;
  },

  handleKey: function(e) {

    if (!this.ownPlayer() ||
        this.ownPlayerState() === CONSTANTS.PLAYER_STATES.DEAD ||
        !CONSTANTS.KEYS[e.which]) { return; }

    var reqDir = CONSTANTS.KEYS[e.which];
    var frame = this.state.currentFrame;
    var player = this.ownPlayer();
    var reqSnake = player.snakeAtFrame(frame);

    // all of this logic just to make sure a player doesn't turn
    // into itself, and that when you press 2 keys rapidly,
    // you can make the first move on the current frame
    // and the second move on the next one

    if (!GameStore.moveRequest(frame)) {

      if (this.eligibleMove(player.dir, reqDir)) {
        GameStore.setMoveRequest(frame, reqDir, reqSnake);
        Actions.requestDirChange(frame, reqDir, reqSnake);
      }

    } else if (!GameStore.moveRequest(frame + 1)) {
      if (this.eligibleMove(GameStore.moveRequest(frame).dir, reqDir)) {

        reqSnake.unshift( MathUtil.posSum(
          reqSnake[0],
          CONSTANTS.DIRS[GameStore.moveRequest(frame).dir]
        ));

        if (reqSnake.length > player.length) { reqSnake.pop(); }

        GameStore.setMoveRequest(frame + 1, reqDir, reqSnake);
        Actions.requestDirChange(frame + 1, reqDir, reqSnake);
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

  calculateBoard: function() {

    if (!this.state.gameState) { return; }

    var segId;
    var framesOffset;
    var tempSnake;
    var showFrame;

    var currentGame = {
      allPositions: {},
      players: {}
    }

    Object.keys(this.state.gameState.apples).forEach(function(pos){
      currentGame.allPositions[pos] = currentGame.allPositions[pos] || [];
      currentGame.allPositions[pos].push('APPLE');
    }.bind(this));

    Object.keys(this.state.gameState.players).forEach(function(id){

      showFrame = id == this.state.ownId ?
        GameStore.currentFrame() : GameStore.currentFrame() - 1;

      tempSnake =
        this.state.gameState.players[id]
        .snakeAtFrame(showFrame);

      currentGame.players[id] = {
        snake: tempSnake,
        action: this.state.gameState.players[id].action
      }

      tempSnake.forEach(function(seg){
        segId = MathUtil.posStr(seg);
        currentGame.allPositions[segId] = currentGame.allPositions[segId] || [];
        currentGame.allPositions[segId].push(id);
      }.bind(this) );

    }.bind(this) );

    return currentGame;

  },

  checkOwnEvents: function(currentGame) {

    // if our own player even has an active snake
    if (currentGame.players &&
        currentGame.players[GameStore.ownId()] &&
        currentGame.players[GameStore.ownId()].snake.length) {

      var player = currentGame.players[GameStore.ownId()];
      var head = player.snake[0];
      var headStr = MathUtil.posStr(head);
      var snakeElementCount = 0;

      // if there is at least one other element which claims
      // the same location as our head claims
      if (currentGame.allPositions[headStr].length > 1) {

        // see what those occupants are, actions accordingly
        currentGame.allPositions[headStr].forEach(function(occupant){
          if (occupant == 'APPLE') {
            player.action = 'GROW';
          } else {
            snakeElementCount += 1;
          }
        }.bind(this) );
      }

      if (MathUtil.outOfBounds(head) || snakeElementCount > 1) { player.action = 'DIE'; }

      // if it turns out we are dead,
      // rewind our snake one frame so it looks like
      // we have stopped at the moment of death
      // and then tell the server about it (with GameStore.slayPlayer())
      if (player.action == 'DIE') {
        var snakeAtDeath = this.state.gameState.players[GameStore.ownId()]
                .snakeAtFrame(GameStore.currentFrame() - 1);
        var snakeTailAtDeath = snakeAtDeath[snakeAtDeath.length - 1];
        var snakeTailStr = '' + snakeTailAtDeath[0] + ',' + snakeTailAtDeath[1];
        currentGame.allPositions[snakeTailStr] = currentGame.allPositions[snakeTailStr] || [];
        currentGame.allPositions[snakeTailStr].push(GameStore.ownId());
        GameStore.slayPlayer();
      }
    }
  },

  cells: function() {

    // my primitive rendering mechanism.
    // to be replaced with canvas, or something...

    var currentGame = this.calculateBoard();
    this.checkOwnEvents(currentGame);
    var squareSize = this.squareSize();

    var els;
    var rows = [];
    var cellId, cellClass;

    for (var row = 0; row < CONSTANTS.BOARD.HEIGHT; row++) {
      for (var col = 0; col < CONSTANTS.BOARD.WIDTH; col++) {
        cellId = '' + row + ',' + col;
        cellClass = 'cell';

        els = currentGame.allPositions[cellId];

        if (els && els.length) {
          els.forEach(function(el) {

            if (el == 'APPLE' && !(cellClass.length > 4)) {
              cellClass += ' apple';
            } else if (el == GameStore.ownId()){
              cellClass = 'cell own-snake';
            } else {
              cellClass = 'cell other-snake';
            }
          });
        }

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
