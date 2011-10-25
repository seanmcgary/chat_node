/**
 * Created by JetBrains PhpStorm.
 * User: seanmcgary
 * Date: 10/20/11
 * Time: 3:02 PM
 * To change this template use File | Settings | File Templates.
 */

function Aim_Connection(client_socket){
    var self = this;

    self.init(client_socket);
}

Aim_Connection.prototype = {
    init: function(client_socket){
        var self = this;
        self.oscar = require('../libs/node-oscar');

        self.conn = null;
        self.connected = false;
        self.client_socket = null;
        self.contacts = null;

        self.set_websocket(client_socket);
    },
    create_connection: function(username, password, aim_connections){
        var self = this;

        self.conn = new self.oscar.OscarConnection({
            connection: {
                username: username,
                password: password
            }
        });

        self.conn.connect(function(err){
            if(err){
                self.connected = false;
                console.log("Failed to connect with username " + username);
                console.log(err);
                // send an error back to the client
                self.client_socket.emit('aim_login', {auth: false, msg: err});

            } else {
                // set as connected
                self.connected = true;

                console.log('Authentication successful for ' + username);
                // get the contact list and send it to the client
                self.contacts = self.conn.contacts.list;
                self.client_socket.emit('aim_login', {auth: true});

                aim_connections[username] = self;

                self.setup_aim_listeners();

            }
        });
    },
    set_websocket: function(socket){
        var self = this;

        self.client_socket = socket;
        self.client_socket.removeAllListeners('get_aim_contacts');
        self.client_socket.removeAllListeners('send_aim_msg');
        
        self.setup_websocket_listeners();
    },
    setup_websocket_listeners: function(){
        var self = this;
        
        self.client_socket.on('get_aim_contacts', function(data){
            console.log('sending contacts');
            self.client_socket.emit('aim_contacts', {contact_list: self.contacts, contact_statuses: self.oscar.USER_STATUSES});
        });

        self.client_socket.on('send_aim_msg', function(data){

        });
    },
    setup_aim_listeners: function(){
        var self = this;
        self.conn.on('im', function(text, sender, flags, when){
            var data = {
                text: text,
                sender: sender,
                flags: flags,
                when: when
            };
            console.log(data);
            self.client_socket.emit('aim_msg_received', data);
        });
    }
};

exports.Aim_Connection = Aim_Connection;