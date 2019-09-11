// Main Socket Server for cadet.
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var players = {};


// Serve the Webpage
app.use(express.static(__dirname + '/client/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/public/index.html');
});


io.on('connection', function (socket) {
  console.log('Player Connected: ' + socket.id);
  // create a new player and add it to our players object
  players[socket.id] = {
    rotation: 0,
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50,
    playerId: socket.id,
    team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
  };
  // send the players object to the new player
  socket.emit('currentPlayers', players);
  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);

  // when a player disconnects, remove them from our players object
  socket.on('disconnect', function () {
    console.log('user disconnected');
    // remove this player from our players object
    delete players[socket.id];
    // emit a message to all players to remove this player
    io.emit('disconnect', socket.id);
  });
});

server.listen(8080, function () {
  console.log(`Listening on ${server.address().port}`);
});