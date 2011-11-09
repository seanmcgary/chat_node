/**
 * Created by JetBrains PhpStorm.
 * User: seanmcgary
 * Date: 10/19/11
 * Time: 9:47 PM
 * To change this template use File | Settings | File Templates.
 */

var contact_list_template = '<div class="list-container">' +
                                '<div class="list-header">AIM</div>' +
                                    '<ul class="contacts-list">' +
                                    '</ul>' +
                                '</div>' +
                             '</div>'

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

        self._list_container = $('<div class="list-container"></div>');

        self._list_header = $('<div class="list-header">AIM</div>');
        self._contact_list = $('<ul class="contacts-list"></ul>');

        self._list_container.append(self._list_header);
        self._list_container.append(self._contact_list);


        self.chat_session._contacts_container.append(self._list_container);


    },
    render_contacts: function(contacts_list){
        var self = this;
        console.log(contacts_list);
        for(var i in contacts_list){
            var contact = new Contact(contacts_list[i], self);

            self.aim_contacts.push(contact);
        }
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