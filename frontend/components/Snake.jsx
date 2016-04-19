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

    var coords = CanvasHelper.coords(
      [e.clientX, e.clientY], {width: this.state.size.width - 8, height: this.state.size.height - 8}
    );

    if (!MathUtil.outOfBounds(coords) && this.ownPlayerState() == CONSTANTS.PLAYER_STATES.DEAD) {
      Actions.requestSpawnLocation(coords);
    }

  },

  handleMouseMove: function(e) {
    e.preventDefault();

    var coords = CanvasHelper.coords(
      [e.clientX, e.clientY], {width: this.state.size.width - 8, height: this.state.size.height - 8}
    )

    if (!MathUtil.outOfBounds(coords)){
      this.renderer.updateMousePosition(coords);
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
      apples: {},
      deadPlayers: {},
      playerState: this.ownPlayerState()
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
        action: this.state.gameState.players[id].action,
        state: this.state.gameState.players[id].state
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
    // (that happen to all players actually, we only tell the server when its us)
    // and not rely on the server to inform us
    var player, ownPlayer, head, headStr, snakeElementCount;
    var snakeAtDeath, snakeTailAtDeath, snakeTailStr;

    currentGame.deathFrame = false;

    if (currentGame.players) {
      Object.keys(currentGame.players).forEach(function(id){

        if (currentGame.players[id].snake.length) {

          player = currentGame.players[id];
          ownPlayer = id == GameStore.ownId();
          head = player.snake[0];
          headStr = MathUtil.posStr(head);
          snakeElementCount = 0;

          if (currentGame.allPositions[headStr].length > 1) {

            currentGame.allPositions[headStr].forEach(function(occupant){
              if (occupant == 'APPLE') { player.action = 'GROW'; }
              else { snakeElementCount += 1; }
            }.bind(this));

          }

          if (MathUtil.outOfBounds(head) || snakeElementCount > 1) {
            player.action = 'DIE';
          }

          if (player.action == 'DIE' || (player.state == CONSTANTS.PLAYER_STATES.DEAD && id != GameStore.ownId())) {

            snakeAtDeath = this.state.gameState.players[id].snakeAtFrame(GameStore.currentFrame() - 1);
            snakeTailAtDeath = snakeAtDeath[snakeAtDeath.length - 1];
            snakeTailStr = MathUtil.posStr(snakeTailAtDeath);

            currentGame.allPositions[snakeTailStr] = currentGame.allPositions[snakeTailStr] || [];
            currentGame.allPositions[snakeTailStr].push(id);
            player.snake.push(snakeTailAtDeath);
            player.snake.shift();

            currentGame.deadPlayers[id] = player;
            delete currentGame.players[id];


            if (id == GameStore.ownId()) {
              currentGame.deathFrame = true;
              GameStore.slayPlayer();
            }
          }

        }
      }.bind(this));
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
          width: this.state.size.width,
          height: this.state.size.height
        }}
        onClick={this.handleClick}
        onMouseMove={this.handleMouseMove}
        ref='gameCanvas'>
      </canvas>
    );
  }

});

module.exports = Snake;
