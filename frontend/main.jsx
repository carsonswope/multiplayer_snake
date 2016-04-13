window.CONSTANTS = require('../constants');

var Snake     = require('./components/Snake');
var React     = require('react');
var ReactDOM  = require('react-dom');
var Actions   = require('./actions');

var GameStore = require('./stores/GameStore');

document.addEventListener('DOMContentLoaded', function(){

  ReactDOM.render(
    <Snake />,
    document.getElementById('snake-game')
  );

});

window.s = io();
//
// s.emit('some event', {data: 'hah'} );

s.on(CONSTANTS.ACTIONS.SERVER_TICK, function(data){
  Actions.serverTick(data);
})
