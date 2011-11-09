/**
 * Created by JetBrains PhpStorm.
 * User: seanmcgary
 * Date: 10/20/11
 * Time: 7:06 PM
 * To change this template use File | Settings | File Templates.
 */

function Contact(contact_data, contact_list){
    var self = this;

    self.prototcol = contact_data.protocol;
    self.contact_list = contact_list;

    self.username = contact_data.username;
    self.status = contact_data.status;
    self.status_msg = contact_data.status_msg;
    self.alias = contact_data.alias;
    self.idle = (contact_data.idle_time != null) ? contact_data.idle_time : false;
    self.idle_time = contact_data.idle_time;
    self.online_since = contact_data.online_since;

    self.chat_id = self.username + ":" + self.protocol;
    
    self.contact_elem = null;

    self.render_contact();

}

Contact.prototype = {
    render_contact: function(){
        var self = this;

        var bubble_color = 'gray-bubble';

        if(self.status == 'online'){
            bubble_color = 'green-bubble';
        }

        if(self.status == 'away'){
            bubble_color = 'red-bubble';
        }

        if(self.idle != false){
            bubble_color = 'yellow-bubble';
        }
        console.log(self.username + ":" + self.status);
        if(self.status != 'offline'){
        
            self.contact_elem = $('' +
                                '<li username="' + self.username + '" protocol="' + self.prototcol + '">' +
                                    '<div class="status-bubble ' + bubble_color + '"></div>' +
                                        (self.alias != null ? self.alias : self.username) + ' ' +
                                        '<small class="status">' + (self.status_msg != null ? self.status_msg : '') + '</small>' +
                                '</li>');

            //self.contact_list.contacts_list_elem.append(self.contact_elem);
            self.contact_list._contact_list.append(self.contact_elem);

            self.bind_contact_click();
        }
    },
    bind_contact_click: function(){
        var self = this;

        if(self.contact_elem != null){
            self.contact_elem.unbind('click');

            self.contact_elem.click(function(){
                var username = $(this).attr('username');
                var protocol = $(this).attr('protocol');
                var chat_id = username + ":" + protocol;
                console.log(self.contact_list.chat_session);
                if(!(chat_id in self.contact_list.chat_session.current_chats_list)){
                    var chatbox = new ChatBox(self.contact_list.chat_session, self, chat_id);

                    self.contact_list.chat_session.current_chats_list[username + ":" + protocol] = chatbox;
                    console.log(self.contact_list.chat_session.current_chats_list[username + ":" + protocol]);
                }

            });
        }
    }

}