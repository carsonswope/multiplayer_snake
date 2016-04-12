var io = require('socket.io');
var express = require('express');
var game = require('./backend/gameSimulation');
var redisClient = require('./backend/redis');

var app = express();

var server = require('http').createServer(app);
var iox = io(server);

app.use(express.static(__dirname + '/assets'));
app.get('/', function(req, res){ res.sendFile('index.html'); });

server.listen(3000);

iox.sockets.on('connection', function(socket){

  console.log('user connected');

  socket.on('some event', function(data){
    console.log(data);
    socket.emit('event', {some: 'data'});
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

})

game.start(redisClient, iox.sockets);
setTimeout(game.stop, 100000);
