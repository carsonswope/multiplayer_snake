var https   = require('https');
var express = require('express');
var config  = require('./config');
var client  = require('./redis');
var socketio= require('./backend/socket');

var gameTick= require('./backend/gameTick');

//this is everything the express server does,
//it simply serves static files

var app = express();

app.use(express.static(__dirname + '/assets'));
app.set('port', config.PORT);
app.get('/', function(req, res){ res.sendFile('index.html'); });

var server = app.listen(app.get('port'), function() {
  console.log('server on port ' + server.address().port);
});

// this sets up the game loop

var loopInterval = setInterval(gameTick, 1000);


/*

links:

http://expressjs.com/en/guide/routing.html

*/
