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
      if (player.canPlace()) {
        player.place(pos);
        redis.hset('players', socket.id, player.json());
      }
    }
  });
};

function setDirection(socket, data){
  // TODO
  // allow player to perhaps undo some move if
  // it requests with a certain amount of time..
  redis.hget('players', socket.id, function(error, playerData){
    if (!error) {
      var player = Player.fromJSON(playerData);
      if (player.canChangeDir()) {
        player.changeDir(data.dir);
        redis.hset('players', socket.id, player.json());
      }
    }
  });
};
