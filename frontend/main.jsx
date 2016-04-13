window.CONSTANTS = require('../constants');

var Snake     = require('./components/Snake');
var React     = require('react');
var ReactDOM  = require('react-dom');
var Actions   = require('./actions');

var GameStore = require('./stores/GameStore');

var socket = io();
Actions.setupClientSocketEvents(socket)

document.addEventListener('DOMContentLoaded', function(){

  ReactDOM.render(
    <Snake />,
    document.getElementById('snake-game')
  );

});

window.addEventListener('resize', Actions.resizeWindow);
