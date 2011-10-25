/**
 * Created by JetBrains PhpStorm.
 * User: seanmcgary
 * Date: 10/20/11
 * Time: 7:06 PM
 * To change this template use File | Settings | File Templates.
 */

function Contact(protocol, data, status_codes, contact_list){
    var self = this;

    self.prototcol = protocol;
    self.contact_list = contact_list;

    self.username = null;
    self.status = null;
    self.status_message = null;
    self.alias = null;
    self.idle = false;
    self.idle_time = null;
    self.online_since = null;
    self.away_set_on = null;

    self.contact_elem = null;

    if(self.prototcol == 'aim'){
        self.aim_status_codes = status_codes;
        self.parse_aim_contact_data(data);
    }

}

Contact.prototype = {
    parse_aim_contact_data: function(data){
        var self = this;
        self.raw_data = data;
        self.username = data.name;

        if('alias' in data.localInfo){
            self.alias = data.localInfo.alias;
        }

        for(var i in self.aim_status_codes){
            if(data.status == self.aim_status_codes[i]){
                self.status = i;
                self.status_display = i.toLowerCase();
            }
        }

        self.online_since = data.onlineSince;

        if('statusMsg' in data){
            self.status_message = data.statusMsg;
        }

        if('idleMins' in data){
            self.idle = true;
            self.idle_time = data.idleMins;
        }

        if(self.status == 'AWAY'){
            self.away_set_on = data.awaySetOn;
        }

        if(self.status != 'OFFLINE'){
            self.render_contact();
        }

    },
    render_contact: function(){
        var self = this;

        var bubble_color = 'gray-bubble';

        if(self.status == 'ONLINE'){
            bubble_color = 'green-bubble';
        }

        if(self.status == 'AWAY'){
            bubble_color = 'red-bubble';
        }

        if(self.idle == true){
            bubble_color = 'yellow-bubble';
        }
        
        self.contact_elem = $('' +
                            '<li username="' + self.username + '" protocol="' + self.prototcol + '">' +
                                '<div class="status-bubble ' + bubble_color + '"></div>' +
                                    (self.alias != null ? self.alias : self.username) + ' ' +
                                    '<small class="status">' + (self.status_message != null ? self.status_message : '') + '</small>' +
                            '</li>');
        
        self.contact_list.contacts_list_elem.append(self.contact_elem);

        self.bind_contact_click();
    },
    bind_contact_click: function(){
        var self = this;

        if(self.contact_elem != null){
            self.contact_elem.unbind('click');

            self.contact_elem.click(function(){
                var username = $(this).attr('username');
                var protocol = $(this).attr('protocol');

                if(!((username + ":" + protocol) in self.contact_list.chat_session.current_chats)){
                    var chatbox = new ChatBox(self.contact_list.chat_session);

                    self.contact_list.chat_session.current_chats[username + ":" + protocol] = chatbox;
                }

            });
        }
    }

}