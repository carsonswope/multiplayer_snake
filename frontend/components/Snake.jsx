var React = require('react');
var PropTypes = React.PropTypes;

var Actions = require('../actions');

var Renderer = require('./Renderer');

var MathUtil = require('../../util/MathUtil');

var CanvasHelper = require('../../util/CanvasPos');

var WindowStore = require('../stores/WindowStore');
var GameStore = require('../stores/GameStore');

var Snake = React.createClass({

  getInitialState: function() {

    this.gameFrame = {};

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
    this.setupCanvas();
  },

  setupCanvas: function() {
    this.canvas = this.refs.gameCanvas;
    this.canvas.width = this.state.size.width;
    this.canvas.height = this.state.size.height;
    this.canvasRect = this.canvas.getBoundingClientRect();
    this.canvasContext= this.canvas.getContext('2d');
    this.renderer = new Renderer(this.canvasContext, WindowStore.size());
  },

  componentWillUnmount: function() {
    this.windowListener.remove();
    this.gameListener.remove();
    window.removeEventListener('keydown', this.handleKey);
  },

  resizeWindow: function() {
    var size = WindowStore.size();
    this.canvas.width = size.width;
    this.canvas.height = size.height;
    this.renderer.resize(size);
    this.setState({ size: size });
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
    e.preventDefault();
    var xPos = e.clientX - this.canvasRect.left;
    var yPos = e.clientY - this.canvasRect.top;

    var coords = CanvasHelper.coords(
      [xPos, yPos], this.state.size
    );

    if (!MathUtil.outOfBounds(coords) && this.ownPlayerState() == CONSTANTS.PLAYER_STATES.DEAD) {
      Actions.requestSpawnLocation(coords);
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

  calculateBoard: function() {

    if (!this.state.gameState) { return; }

    var segId;
    var framesOffset;
    var tempSnake;
    var showFrame;

    var currentGame = {
      allPositions: {},
      players: {},
      apples: {}
    }

    Object.keys(this.state.gameState.apples).forEach(function(pos){
      currentGame.allPositions[pos] = currentGame.allPositions[pos] || [];
      currentGame.allPositions[pos].push('APPLE');

      currentGame.apples[pos] = true;
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
    // then we see if we can preemptively catch
    // events (death, growing) that happen to the player
    // and not rely on the server to inform us
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
          if (occupant == 'APPLE') { player.action = 'GROW'; }
          else { snakeElementCount += 1; }
        }.bind(this) );
      }

      if (MathUtil.outOfBounds(head) || snakeElementCount > 1) { player.action = 'DIE'; }

      // if it turns out we are dead,
      // rewind our snake one frame so it looks like
      // we have stopped at the moment of death
      // and then tell the server about it (with GameStore.slayPlayer())
      if (player.action == 'DIE') {

        var snakeAtDeath = this.state.gameState.players[GameStore.ownId()].snakeAtFrame(GameStore.currentFrame() - 1);
        var snakeTailAtDeath = snakeAtDeath[snakeAtDeath.length - 1];
        var snakeTailStr = '' + snakeTailAtDeath[0] + ',' + snakeTailAtDeath[1];

        currentGame.allPositions[snakeTailStr] = currentGame.allPositions[snakeTailStr] || [];
        currentGame.allPositions[snakeTailStr].push(GameStore.ownId());
        player.snake.push(snakeTailAtDeath);
        player.snake.shift();

        GameStore.slayPlayer();
      }

    }
  },

  assembleFrame: function() {
    var currentGame = this.calculateBoard();
    this.checkOwnEvents(currentGame);
    this.gameFrame = currentGame;
  },

  updateRenderer: function(){
    if (this.renderer) {
      this.assembleFrame();
      this.renderer.giveCurrentFrame(this.gameFrame);
      this.renderer.scheduleNextFrame(GameStore.nextFrameTime());
    }
  },

  render: function() {

    this.updateRenderer();

    return (
      <canvas
        style={{
          width: this.state.size.width - 2,
          height: this.state.size.height - 5
        }}
        onClick={this.handleClick}
        ref='gameCanvas'>
      </canvas>
    );
  }

});

module.exports = Snake;
