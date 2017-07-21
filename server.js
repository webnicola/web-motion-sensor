
const express = require('express'),
      app     = express(),
      server  = require('http').createServer(app),
      io      = require('socket.io').listen(server);

const raspi = require('raspi-io'),
      five = require('johnny-five'),
      board = new five.Board({io: new raspi()});

server.listen(8080);
//tell the server that ./public/ contains the static webpages
app.use(express.static('public'));

//set global pir
let motion = {};

board.on('ready', function() {
	console.log('board is ready');

	// Create a new `motion` hardware instance.
	motion = new five.Motion('P1-7'); //pin 7 (GPIO 4)

	// 'calibrated' occurs once, at the beginning of a session,
	motion.on('calibrated', function() {
		console.log('calibrated');
	});
  
});

//send motiondata reading out to connected clients
//w/ sockets
io.sockets.on('connection', socket => {
  console.log('connection user');
  
	// 'motionstart' events are fired when the 'calibrated'
	// proximal area is disrupted, generally by some form of movement
	motion.on('motionstart', function() {
		console.log('motionstart');
    
    socket.emit('pirstatus', {"value": true});
	});

	// 'motionend' events are fired following a 'motionstart' event
	// when no movement has occurred in X ms
	motion.on('motionend', function() {
		console.log('motionend');
    socket.emit('pirstatus', {"value": false});
	});
  
  //raw data
  //motion.on('data', function(data) {
	//	console.log(data);
	//});
});



