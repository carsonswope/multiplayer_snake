var React = require('react');
var PropTypes = React.PropTypes;

var GameStore = require('../stores/GameStore');

var Header = React.createClass({

  getInitialState: function() {
    return ({
       gameState: GameStore.currentState(),
       ownId: GameStore.ownId()
     });
  },

  componentDidMount: function() {
    this.gameListener = GameStore.addListener(this.gameUpdate);
  },

  componentWillUnmount: function() {
    this.gameListener.remove();
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

  message: function() {

    switch (this.ownState()) {
      case undefined:
        return 'connecting..'
      case CONSTANTS.PLAYER_STATES.DEAD:
        return 'click on board to join';
      case CONSTANTS.PLAYER_STATES.PLACED:
        return 'arrow key to start moving';
      case CONSTANTS.PLAYER_STATES.PLAYING:
        return 'current length: ' +
          this.state.gameState.players[this.state.ownId].snake.length;
    }

  },

  render: function() {
    return (
      <div id='header-main'>
        <div id='header-title'>
          Multiplayer Snake!
        </div>
        <div id='header-message'>
          {this.message()}
        </div>
      </div>
    );
  }

});

module.exports = Header;
