// STEP 11 - initiate a websocket connection from the client - this fires a connection event from the io on the server
// without a listener though, nothing will happen - go to server.js for step 12
var socket = io();

// STEP 15 - the event emitted in step 14 won't do anything is there is no listener on the client side to catch it. Set up a listener
// then go to server.js for step 16
var connectionCount = document.getElementById('connection-count');
var voteTally = document.getElementById('vote-tally');
var voteMessage = document.getElementById('vote-message');
// this is why we put the div in index.html

socket.on('usersConnected', function(count) {
  connectionCount.innerText = 'Connected Users: ' + count;
});

// STEP 18 - add a listener for the status message emitted from the server to single sockets - then go to index.html for step 19 - add
// buttons to help us send messages from the client to the server
var statusMessage = document.getElementById('status-message');

socket.on('statusMessage', function(message) {
  statusMessage.innerText = message;
});

socket.on('voteMessage', function(message) {
  //var result = '';
  //for (var choice in votes) {
  //  result += choice
  //}
  voteMessage.innerText = 'You have voted for : ' + message;
});

// STEP 27 - listen for 'voteCount' message from server.js
socket.on('voteCount', function(votes) {
  var result = '';
  for (var choice in votes) {
    result += choice + ': ' + votes[choice] + ' ';
  }

  voteTally.innerText = 'Tallied Votes' + ': ' + result;
});

// STEP 20 - add event listeners for the buttons the client side will use (from index.html) - console.log first, then add socket.send function
// we need a listener on server.js to catch our socket.send - go to server.js for step 21
var buttons = document.querySelectorAll('#choices button');

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    //console.log(this.innerText);
    socket.send('voteCast', this.innerText);
  });
}
