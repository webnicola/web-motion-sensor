// connect socket.io
var socket = io.connect();

var app = new Vue({
  el: '#app',
  data: {
    pirvalue: false,
    pirout: "#000"
  },
  methods: {
    pirstatus: function (pirvalue) {
      if(pirvalue) {
        this.pirout = 'lime';
      } else {
        this.pirout = '#000';
      }
      this.pirvalue = pirvalue;
    }
  }
});

//update message with sensor value
 socket.on('pirstatus', function (data) {
   if (data) {
    console.log(data.value);
    app.pirstatus(data.value);
  } else {
    console.log('no data');
    app.pirstatus = "No data from PIR";
  }
 });