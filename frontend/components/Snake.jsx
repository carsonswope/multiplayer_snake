var React = require('react');

var Board = require('./Board');
var Header = require('./Header');

var Snake = React.createClass({

  render: function() {
    return (
      <div>
        <Header />
        <Board />
      </div>
    );
  }

});

module.exports = Snake;
