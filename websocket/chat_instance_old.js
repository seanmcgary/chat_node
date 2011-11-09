/**
 * Created by JetBrains PhpStorm.
 * User: seanmcgary
 * Date: 11/7/11
 * Time: 11:15 PM
 * To change this template use File | Settings | File Templates.
 */
var Aim_Connection = require('aim_connection_old.js').Aim_Connection;

function Chat_Instance(socket, protocol){
    var self = this;

    self.set_socket(socket);

    // protocol of the chat inst (aim, jabber, etc)
    self.protocol = protocol;

    // protocol based connection
    self.connection = null;

    switch(self.protocol){
        case 'aim':
            self.connection = new Aim_Connection(self);
            break;
    }

};

Chat_Instance.prototype = {
    set_socket: function(socket){
        var self = this;

        self.socket = socket;
        self.bind_events();
    },
    bind_events: function(){
        var self = this;

        /*self.socket.on('send_msg', function(data){
            self.handle_send_msg(data);
        });*/

    },
    auth: function(username, password, callback){
        var self = this;

        self.connection.auth(username, password, function(error, data){
            if(!error){
                self.socket.emit('login_ack', data);
                callback(true, data);
            } else {
                self.socket.emit('login_nack', data);
                callback(false, data);
            }

        });
    },
    reinit_existing_connection: function(){
        var self = this;

        self.connection.post_connection_setup(self, function(){
            self.socket.emit('login_ack', {
                username: self.connection.username,
                contacts: self.connection.contact_list
            });
        })
    },
    /**
     * Message payload includes:
     *  {
     *      text,
     *      username,
     *      protocol
     *  }
     * @param msg_data
     */
    handle_received_msg: function(msg_data){
        var self = this;

        self.socket.emit('msg_received', msg_data);
    },
    handle_send_msg: function(msg_data){
        var self = this;

        self.connection.send_msg(msg_data);
        console.log
    }
};

exports.inst = Chat_Instance;