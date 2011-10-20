var io = require('socket.io');
var express = require('express');

var app = express.createServer();

io = io.listen(app);

app.listen(8080);

io.sockets.on('connection', function(socket){
    
    socket.on('chat_login', function(data){
        console.log('chat login');
        console.log(data);

        socket.emit('chat_login_status', {status: true});
    });

    
});