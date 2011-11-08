/**
 * Created by JetBrains PhpStorm.
 * User: seanmcgary
 * Date: 10/19/11
 * Time: 9:27 PM
 * To change this template use File | Settings | File Templates.
 */

function ChatSession(chat_container_elem, socket){
    var self = this;

    self.container_elem = chat_container_elem;

    self.socket = socket;

    self.current_chats = {};
}

ChatSession.prototype = {
    init: function(){
        var self = this;
        console.log("ChatSession init");

        $('#login').css('display', 'none');

        self.chat_tabs = $('<div class="chat-tabs" id="chat-tabs"></div>');
        self.chat_tabs_list = $('<ul id="tabs-list"></ul>');
        
        self.chat_container = $('<div class="chat-container"></div>');

        self.container_elem.append(self.chat_tabs);
        self.chat_tabs.append(self.chat_tabs_list);
        self.container_elem.append(self.chat_container);

        self.contact_list = new ContactList(self);

        self.current_chats = $('<div class="current-content"></div>');

        self.current_chats_list = {};

        self.chat_container.append(self.current_chats);

        self.container_elem.css('display', 'block');

        self.contact_list.get_contacts();
    },
    authenticate_user: function(creds){
        var self = this;
        
        self.socket.emit('aim_chat_login', creds);

        self.socket.on('aim_login', function(data){
            if(data.auth == true){
                self.init();
            } else {
                console.log(data);
            }
        });

        self.socket.on('aim_msg_received', function(data){
            console.log(data);
            console.log(self.current_chats_list);

            var chat_id = (data.sender.name + ':aim');

            if(!(chat_id in self.current_chats_list)){
                var chatbox = new ChatBox(self, self.contact_list.get_contact('aim', data.sender.name), chat_id);

                self.current_chats_list[chat_id] = chatbox;

            }

            var chat = self.current_chats_list[chat_id];
            var time = new Date();
            chat.write_chat_line({
                name: data.sender.name,
                time: time.getHours() + ":" + time.getMinutes(),
                text: data.text
            });
        });
    },
    setup_listeners: function(){

    },
    focus_chat_box: function(chat_id){
        $('.chat-box').css('display', 'none');

        $('.chat-box[chat_id="' + chat_id + '"]').css('display', 'block');

    }
};