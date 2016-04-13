var React = require('react');
var PropTypes = React.PropTypes;

var Actions = require('../actions');

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
      ownId: GameStore.ownId()
    });
  },

  ownPlayer: function() {
    if (this.state.gameState) {
      return this.state.gameState.players[this.state.ownId]
    }
  },

  ownState: function() {
    if (this.ownPlayer()) {
      return this.ownPlayer().state;
    }
  },

  handleClick: function(e) {
    if (this.ownState() == CONSTANTS.PLAYER_STATES.DEAD){
      var requestedSpawnLocation =
        e.target.id.split(',').map(function(coord){
          return parseInt(coord);
        });
      Actions.requestSpawnLocation(requestedSpawnLocation);
    }
  },

  handleKey: function(e) {

    if ((this.ownState() == CONSTANTS.PLAYER_STATES.PLACED ||
        this.ownState() == CONSTANTS.PLAYER_STATES.PLAYING) &&
        CONSTANTS.KEYS[e.which]) {

      console.log(e.which);
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

  cells: function() {

    var rows = [];
    var cells;
    var row;
    var id;
    var squareSize = this.squareSize();

    for (var row = 0; row < CONSTANTS.BOARD.HEIGHT; row++) {
      for (var col = 0; col < CONSTANTS.BOARD.WIDTH; col++) {
        id = '' + row + ',' + col;

        rows.push(
          <div id={id}
            className='cell'
            key={id}
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
