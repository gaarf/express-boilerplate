jQuery.ready(function() {


  var socket = new io.Socket(); 
  socket.connect();
  
  socket.on('connect', function(){
    log('connect', this);
  });
  
  socket.on('message', function(){
    log('message', this, arguments);
  });
  
  socket.on('disconnect', function(){
    log('disconnect', this);
  });


});