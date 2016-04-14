var redis = require('./redis');
var Player = require('../util/Player');

exports.setupSocketEvents = function(socket){

  connectUser(socket);

  socket.on(
    'disconnect',
     disconnectUser.bind(global, socket));

  socket.on(
    CONSTANTS.PLAYER_MOVES.SET_STARTING_POS,
    setStartingPos.bind(global, socket));

  socket.on(
    CONSTANTS.PLAYER_MOVES.SET_DIRECTION,
    setDirection.bind(global, socket));

};

function connectUser(socket){
  var newPlayer = new Player({id: socket.id});
  redis.hset('players', socket.id, newPlayer.json() );
  console.log('user ' + socket.id + ' connected');
}

function disconnectUser(socket){
  redis.hdel('players', socket.id );
  console.log('user ' + socket.id + ' disconnected');
};

function setStartingPos(socket, pos){
  redis.hget('players', socket.id, function(error, playerData){
    if (!error) {
      var player = Player.fromJSON(playerData);
      player.handleClientSetPositionRequest(pos);
      redis.hset('players', socket.id, player.json());
    }
  });
};

function setDirection(socket, data){
  redis.hget('players', socket.id, function(error, playerData){
    if (!error) {
      var player = Player.fromJSON(playerData);
      player.handleClientSetDirectionRequest(data);
      redis.hset('players', socket.id, player.json());
    }
  });
};
