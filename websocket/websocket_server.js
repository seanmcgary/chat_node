var io = require('socket.io');
var express = require('express');
var Chat_Instance = require('./chat_instance.js').Chat_Instance;
var app = express.createServer();

io = io.listen(app);

io.set('log level', 1);

app.listen(8080);

var connections = {};

io.sockets.on('connection', function(socket){
    var conn = {};
    conn.socket = socket;
    
    conn.send_msg = function(data){
        
        if(data.chat_id in connections){
            connections[data.chat_id].send_msg(data);
        } else {
            console.log('not in conections');
        }
    }

    conn.login = function(data){
        console.log(data);

        var chat_id = data.username + ":" + data.protocol;
        conn.chat_id = chat_id;

        if(conn.chat_id in connections){
            console.log("Getting existing connection");
            connections[chat_id].reinit_chat_instance(socket, data.protocol, function(err, data){
                if(err){
                    socket.emit('login_nack', data);
                } else {
                    socket.emit('login_ack', data);
                }
            });

        } else {
            console.log("Creating new connection");

            var chat = new Chat_Instance(socket, data.protocol);
            

            chat.auth(data.username, data.password, function(err, data){

                if(err){
                    console.log("Auth failed");
                    socket.emit('login_nack', data);
                } else {
                    console.log("Auth success");
                    connections[chat_id] = chat;
                    socket.emit('login_ack', data);
                }
            });
        }
    }

    socket.on('send_msg', conn.send_msg);
    
    socket.on('chat_login', conn.login);



    
});