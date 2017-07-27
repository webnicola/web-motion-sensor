// web server
const express = require('express'),
      app     = express(),
      http    = require('http').createServer(app),
      io      = require('socket.io')(http);

// sensor data
const raspi = require('raspi-io'),
      five = require('johnny-five'),
      board = new five.Board({io: new raspi()});

const EVENTS = {
   MOTION_DETECTED: 'motion detected'
};


board.on('ready', function() {
	console.log('board is ready');

	// Create a new `motion` hardware instance.
	const motion = new five.Motion('P1-7'); //pin 7 (GPIO 4)

	// 'calibrated' occurs once, at the beginning of a session,
	motion.on('calibrated', function() {
		console.log('calibrated');
	});
  
  //send motiondata reading out to connected clients
  //w/ sockets
  io.on('connection', (socket) => {  
    console.log('connection user');
    
  	// 'motionstart' events are fired when the 'calibrated'
  	// proximal area is disrupted, generally by some form of movement
  	motion.on('motionstart', function() {
  		console.log('motionstart', Date.now());
      socket.emit(EVENTS.MOTION_DETECTED);
  	});

  	// 'motionend' events are fired following a 'motionstart' event
  	// when no movement has occurred in X ms
  	motion.on('motionend', function() {
  		console.log('motionend', Date.now());
  	});
    
    // The "change" event is fired whenever a change within the motion detection field is observed.
    //motion.on('change', function() {
  	//	console.log('change');
  	//});
    
    //The "data" event is fired as frequently as the user defined freq will allow in milliseconds.
    //motion.on('data', function(data) {
  	//	console.log(data);
  	//});
  });
  
});


//tell the server that ./public/ contains the static webpages
app.use(express.static('public'));

http.listen(8080, () => {
   console.log('listening on *:8080');
});
