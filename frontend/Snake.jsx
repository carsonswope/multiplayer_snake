window.CONSTANTS = require('../constants');

document.addEventListener('DOMContentLoaded', function(){

  window.s = io();
  //
  // s.emit('some event', {data: 'hah'} );
  s.on('event', function(data){
    var x = JSON.parse(data.data);
    console.log(x[0]);
    console.log(x[1]);
    console.log(s.id);
  });

  console.log(s.id);

});
