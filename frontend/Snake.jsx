document.addEventListener('DOMContentLoaded', function(){

  window.s = io();
  //
  // s.emit('some event', {data: 'hah'} );
  s.on('event', function(data){
    console.log(data);
  });


});
