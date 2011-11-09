/**
 * Created by JetBrains PhpStorm.
 * User: seanmcgary
 * Date: 10/20/11
 * Time: 3:02 PM
 * To change this template use File | Settings | File Templates.
 */


function Aim_Connection(chat_instance){
    var self = this;

    self.oscar = require('../libs/node-oscar/oscar.js');

    self.aim_connection = null;
    self.connected = false;
    self.username = null;
    self.contact_list = [];
    self.chat_instance = chat_instance;
    self.protocol = 'aim';
}

Aim_Connection.prototype = {
    // new functions
    //-----------------------------------------------------------------------------------------------------------------
    auth: function(username, password, callback){
        var self = this;

        self.aim_connection = new self.oscar.OscarConnection({
            connection: {
                username: username,
                password: password
            }
        });

        self.aim_connection.connect(function(err){
            if(err){
                self.connected = false;
                console.log("Failed to connect with username " + username);
                console.log(err);

                callback(true, err);

            } else {
                // set as connected
                self.connected = true;
                self.username = username;
                
                console.log('Authentication successful for ' + username);

                self.post_connection_setup(null, function(){
                    callback(false, {contacts: self.contact_list, username: username});
                });


            }
        });
    },
    post_connection_setup: function(chat_instance, callback){
        var self = this;

        if(chat_instance != null){
            self.chat_instance = chat_instance;
        }
        
        // now that we are connected, set up the listeners
        self.setup_aim_listeners();

        self.generify_contacts(self.aim_connection.contacts.list, function(){
            callback();
        });
    },
    generify_contacts: function(contacts_list, callback){
        var self = this;
        self.contact_list = [];
        
        for(var i in contacts_list){
            if(contacts_list[i].name.toLowerCase() == 'buddies'){
                var buddies = contacts_list[i];

                for(var j in buddies.contacts){
                    var contact = buddies.contacts[j];

                    var new_contact = {};

                    new_contact.username = contact.name;

                    if('alias' in contact.localInfo && typeof contact.localInfo.alias != 'undefined'){
                        new_contact.alias = contact.localInfo.alias;
                    } else {
                        new_contact.alias = new_contact.username;
                    }

                    new_contact.online_since = contact.onlineSince;

                    // grab the status form the status codes
                    for(var i in self.oscar.USER_STATUSES){
                        if(contact.status == self.oscar.USER_STATUSES[i]){
                            new_contact.status = i.toLowerCase();
                        }
                    }

                    console.log(new_contact.username + ":" + contact.status);

                    if('statusMsg' in contact && typeof contact.statusMsg != 'undefined'){
                        new_contact.status_msg = contact.statusMsg;
                    } else {
                        new_contact.status_msg = null;
                    }

                    if('idleMins' in contact && typeof contact.idleMins != 'undefined'){
                        new_contact.idle_time = contact.idleMins;
                    } else {
                        new_contact.idle_time = null;
                    }

                    new_contact.protocol = self.protocol;

                    self.contact_list.push(new_contact);
                }
                
            }
        }

        callback();
    },
    send_msg: function(msg_data){
        console.log('sending');
        console.log(msg_data);
    },
    msg_received: function(text, sender, flags, when){
        var self = this;
        var data = {
            text: text,
            username: sender.name,
            protocol: self.protocol
        };

        console.log(data);
        console.log(self.chat_instance);
        self.chat_instance.handle_received_msg(data);
    },
    contact_offline: function(user){
        var self = this;
        console.log(user);
    },
    contact_online: function(user){
        var self = this;
        console.log(user);
    },
    contact_update: function(user){
        var self = this;
        console.log(user);
    },
    setup_aim_listeners: function(){
        var self = this;

        self.aim_connection.removeListener('im', self.msg_received);
        self.aim_connection.removeListener('contactonline', self.contact_online);
        self.aim_connection.removeListener('contactoffline', self.contact_offline);
        self.aim_connection.removeListener('contactupdate', self.contact_update);

        self.aim_connection.on('im', self.msg_received);
        self.aim_connection.on('contactonline', self.contact_online);
        self.aim_connection.on('contactoffline', self.contact_offline);
        self.aim_connection.on('contactupdate', self.contact_update);
    }
};

exports.Aim_Connection = Aim_Connection;