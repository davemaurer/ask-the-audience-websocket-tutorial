// PREVIOUSLY - create a dir for the project(ask-the-audience), a dir: public, files client.js, index.html
// git init, npm init, npm install --save express socket.io lodash

// STEP 1 - require libraries
const http = require('http');
const express = require('express');

// STEP 2 - instantiate express - which is a NODE library for running basic HTTP servers
const app = express();

// STEP 22 - create an object to store votes(button click messages). Go down to socket.on for step 23
var votes = {};

// STEP 25 - write a function to count votes, starting at zero and incrementing the voteCount for each vote
// go to io.on('connection') for step 26
function countVotes(votes) {
  var voteCount = {
    StarWars: 0,
    DumbandDumber: 0,
    Xmen: 0,
    Chocolate: 0
  };
  for (vote in votes) {
    voteCount[votes[vote]]++
  }
  return voteCount;
}

// STEP 3 - have Express server the public directory we created
app.use(express.static('public'));

// STEP 4 - set up Express to serve index.html as '/'(root)
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// STEP 6 - tell server what port to listen on (if ENV var is set we use that, otherwise default to 3000)
var port = process.env.PORT || 3000;

// STEP 5 - Pass the object created in step 4 to to NODE's http module to produce a running server
var server = http.createServer(app);
//STEP 6 cont.
server.listen(port, function() {
  console.log('Listening on port ' + port + '.');
});

//STEP 9 - set up socket.io - the order is important - go to index.html for step 10
const socketIo = require('socket.io');
const io = socketIo(server);

// OPTIONAL to step 5 and 6 using chaining
//var server = http.createServer(app)
//  .listen(port, function() {
//    console.log('Listening on port ' + port + '.');
//  });

// STEP 12 - set up an event listener for the connection event from the client - go to index.html for step 13
io.on('connection', function(socket) {
  console.log('A user has connected.', io.engine.clientsCount);

// STEP 14 - emit an event to all connected users alerting them to the new count of connections - continue this a few lines down
// then go to client.js for step 15
  io.sockets.emit('usersConnected', io.engine.clientsCount); // emits to all (sockets)clients connected

// STEP 16 - emit a message to just the single socket(client) connected - go to index.html for for step 17
  socket.emit('statusMessage', 'You have connected.'); // emits to just a single client

  socket.on('disconnect', function() {
    console.log('A user has disconnected.', io.engine.clientsCount);
// STEP 24 - remove the user's vote from the votes array when they disconnect - go up to the votes variable for step 25
    delete votes[socket.id];
    console.log(votes);
    // STEP 14 cont.
    socket.emit('voteCount', countVotes(votes));

    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });

  // STEP 21 - listen for socket.send event triggered when buttons are clicked on the client side -  now we need
  // a way to store the button click results. Go to the top for step 22
  socket.on('message', function(channel, message) {
    //console.log(channel, message);
// STEP 23 - store button click messages(votes) in the votes hash with the socket id as the key - go up a few lines to socket.on('disconnect')
// for step 24
    if (channel === 'voteCast') {
      votes[socket.id] = message;
      //console.log(votes);
// STEP 26 - emit voteCount and the countVotes function when receiving a message(button click for vote) from the client - same code goes in
// on('disconnect') above - go to client.js for step 27
      io.sockets.emit('voteCount', countVotes(votes));
      socket.emit('voteMessage', message);
    }
  });
});


// STEP 7 - export the module
module.exports = server;

// STEP 8 - add text to index.html, then fire up the server to make sure everything works: npm start
// back up a few lines for step 9
