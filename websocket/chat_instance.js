/**
 * Created by JetBrains PhpStorm.
 * User: seanmcgary
 * Date: 11/8/11
 * Time: 8:48 PM
 * To change this template use File | Settings | File Templates.
 */
var Aim_Connection = require('./aim_connection.js').Aim_Connection;

function Chat_Instance(socket, protocol){
    var self = this;

    // chat protocol being used (aim, jabber, etc)
    self.protocol = protocol;

    // reference to the websocket
    self.set_socket(socket);

    // instance of the chat connection
    self.connection = null;

    // if the connection is established
    self.connected = false;

    self.username = null;
    self.password = null;

    self.chat_init();

};

Chat_Instance.prototype = {
    chat_init: function(){
        var self = this;

        switch(self.protocol){
            case 'aim':
                self.connection = new Aim_Connection();
                self.connection.init(self);
                break;
        }
    },
    reinit_chat_instance: function(socket, protocol, callback){
        var self = this;

        self.protocol = protocol;

        self.set_socket(socket);

        // reset some stuff in the AIM connection
        self.connection.init(self);

        self.connection.reinit(function(err, data){
            if(err){
                callback(true, data);
            } else {
                callback(false, data);
            }
        });
    },
    set_socket: function(socket){
        var self = this;

        self.socket = socket;
        self.bind_socket_events();
    },
    bind_socket_events: function(){
        var self = this;
    },
    auth: function(username, password, callback){
        var self = this;

        self.connection.auth(username, password, function(err, data){
            if(err){
                callback(true, data);
            } else {
                callback(false, data);
            }
        });

    },
    is_connected: function(callback){
        var self = this;

        callback(self.connected);
    }
};

exports.Chat_Instance = Chat_Instance;