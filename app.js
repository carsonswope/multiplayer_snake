var https   = require('https');
var express = require('express');
var config  = require('./config');
var client  = require('./redis');
var socketio= require('./data/socket');

var app = express();

app.use(express.static(__dirname + '/assets'));

app.set('port', config.PORT);

app.get('/dummy_page', function(req, res){
    var clientRequest = https.request({
      host: 'api.foursquare.com',
      path: '/v2/venues/search?ll=' + req.query.lat + ',' + req.query.lon +'&v=20140128&query=' + req.query.query
  }, function(httpResponse){
      console.log('served page');
      res.setHeader('content-type', 'application/json');
      httpResponse.pipe(res);
  }).end();
});

app.get('/', function(req, res){
  res.send('hello world');
});

var server = app.listen(app.get('port'), function() {
  console.log('server on port ' + server.address().port);
});


/*

links:

http://expressjs.com/en/guide/routing.html

*/
