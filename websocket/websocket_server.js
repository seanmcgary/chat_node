var io = require('socket.io');
var express = require('express');
var Aim_Connection = require('./aim_connection').Aim_Connection;

var app = express.createServer();

io = io.listen(app);

io.set('log level', 1);

app.listen(8080);

var aim_connections = {};

io.sockets.on('connection', function(socket){
    var conn = {};
    conn.socket = socket;
    conn.aim_conn = new Aim_Connection(conn.socket);

    conn.socket.on('aim_chat_login', function(data){

        if(data.username in aim_connections){
            console.log("connection exists, fetching");

            conn.aim_conn = aim_connections[data.username];
            conn.aim_conn.set_websocket(socket);

            conn.socket.emit('aim_login', {auth: true});
        } else {
            console.log('creating new connection');
            conn.aim_conn.create_connection(data.username, data.password, aim_connections);

        }
    });

    
});