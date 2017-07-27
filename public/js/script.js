// connect socket.io
var socket  = io.connect();

var app = new Vue({
  el: '#app',
  data: {
    TIMEOUT: 11000,
    display: 0,
    bgcolor: 'pink',
    free: true,
    timer: null
  },
  methods: {
    run: function () {
      if (this.free) {
        console.log('RUN');
        this.free   = false;
        this.bgcolor = 'lime';
        this.display = 1;
        this.timer  = setTimeout(this.reset, this.TIMEOUT);
      } else {
        console.log('BUSY');
      }
    },
    reset: function () {
      console.log('RESET');
      if (!this.free) {
        this.display = 0;
        this.bgcolor = 'pink';
        clearTimeout(this.timer);
        this.free   = true;
        console.log('FREE');
      }
    },
  }
});

//update message with sensor value
socket.on('motion detected', function () {
  console.log('motion detected');
  app.run();
});