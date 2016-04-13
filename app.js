var express = require('express');
var redis = require('./backend/redis');
var game = require('./backend/gameSimulation');
var ioEvents = require('./backend/socketEvents');

// allow constants to be
global.CONSTANTS = require('./constants');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// serving static assets and home page
// listen to specified port
app.use(express.static(__dirname + '/assets'));
app.get('/', function(req, res){ res.sendFile('index.html'); });
server.listen(process.env.PORT);

// remove old data from redis cache, when starting server
// shouldn't be necessary in production
// but in testing sometimes the server crashes and leaves stuff in the cache
redis.flushdb();

io.sockets.on('connection', ioEvents.setupSocketEvents);

game.start(redis, io.sockets);
// setTimeout(game.stop, 100000);
