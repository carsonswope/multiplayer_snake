var io = require('socket.io');
var express = require('express');

var app = express()
var server = require('http').createServer(app)
var io = io.listen(server);

var game = require('./backend/gameSimulation');


app.use(express.static(__dirname + '/assets'));
app.get('/', function(req, res){ res.sendFile('index.html'); });

server.listen(3000);



io.sockets.on('connection', function(socket){

  console.log('user connected');

  console.log(socket);

  socket.on('some event', function(data){
    console.log(data);
    socket.emit('event', {some: 'data'});
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

})

game.start();
setTimeout(game.stop, 10000);
