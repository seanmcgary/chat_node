/**
 * Created by JetBrains PhpStorm.
 * User: seanmcgary
 * Date: 10/19/11
 * Time: 9:47 PM
 * To change this template use File | Settings | File Templates.
 */
function ContactList(chat_session){
    var self = this;

    self.chat_session = chat_session;
    self.socket = self.chat_session.socket;

    self.aim_contacts = [];

    self.init();
}

ContactList.prototype = {
    init: function(){
        var self = this;



        self.contacts_container = $('<div class="contacts"></div>');
        self.contacts_list_elem = $('<ul class="contacts-list"></ul>');

        self.chat_session.chat_container.append(self.contacts_container);
        self.contacts_container.append(self.contacts_list_elem);

        self.socket.on('aim_contacts', function(data){
            console.log(data);
            for(var i in data.contact_list){
                var list = data.contact_list[i];
                if(list.name.toLowerCase() == 'buddies'){
                    console.log(list.contacts);
                    for(var j in list.contacts){
                        var contact = new Contact('aim', list.contacts[j], data.contact_statuses, self);

                        self.aim_contacts.push(contact);
                    }

                }
            }
        });
    },
    get_contacts: function(){
        var self = this;

        self.socket.emit('get_aim_contacts', {});

    },
    get_contact: function(protocol, username){
        var self = this;
        var ret_contact = null;

        if(protocol == 'aim'){
            for(var i in self.aim_contacts){
                if(self.aim_contacts[i].username == username){
                    ret_contact = self.aim_contacts[i];
                }
            }
        }

        return ret_contact;
    }
};