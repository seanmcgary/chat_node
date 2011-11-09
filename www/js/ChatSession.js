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

    self.current_chat = null;

    self.current_chats_list = {};

    self.setup_listeners();
}

ChatSession.prototype = {
    init: function(chat_data){
        var self = this;
        console.log("ChatSession init");

        $('#login').css('display', 'none');

        self._chat_container = $('<div class="chat-container"></div>');
        // direct children of chat_container
        self._contacts = $('<div class="contacts"></div>');
        self._current_content = $('<div class="current-content"></div>');

        self._current_content_toolbar = $('<div class="toolbar"></div>');

        self._current_content.append(self._current_content_toolbar);

        self._chat_container.append(self._contacts);
        self._chat_container.append(self._current_content);

        self.container_elem.css('display', 'block');
        self.container_elem.append(self._chat_container);

        self.resize();

        self.contact_list = new ContactList(self);

        self.contact_list.render_contacts(chat_data.contacts);

        


        //self.chat_tabs = $('<div class="chat-tabs" id="chat-tabs"></div>');
        //self.chat_tabs_list = $('<ul id="tabs-list"></ul>');

        /*self.chat_container = $('<div class="chat-container"></div>');

        //self.container_elem.append(self.chat_tabs);
        //self.chat_tabs.append(self.chat_tabs_list);
        self.container_elem.append(self.chat_container);

        self.contact_list = new ContactList(self);

        self.current_chats = $('<div class="current-content"></div>');

        self._chat_toolbar = $('<div class="toolbar"></div>');

        self._contacts_container = $('<div class="contacts"></div>');

        self.current_chats.append(self._chat_toolbar);

        self.current_chats_list = {};

        self.chat_container.append(self.current_chats);

        self.container_elem.css('display', 'block');

        self.chat_container.append(self._contacts_container);

        self.resize();

        //self.contact_list.render_contacts(chat_data.contacts);*/
    },
    authenticate_user: function(login){
        var self = this;

        self.socket.emit('chat_login', login);
        

    },
    resize: function(){
        var self = this;

        self._current_content.css('height', window.innerHeight + 'px');

    },
    setup_listeners: function(){
        var self = this;

        self.socket.on('login_ack', function(data){
            console.log(data);

            self.init(data);
        });

        self.socket.on('login_nack', function(data){
            console.log(data);
            console.log("Login failed");
        });

        self.socket.on('msg_received', function(data){
            console.log(data);
            console.log(self.current_chats_list);

            var chat_id = (data.username + ":" + data.protocol);

            if(!(chat_id in self.current_chats_list)){
                var chatbox = new ChatBox(self, self.contact_list.get_contact(data.protocol, data.username), chat_id);

                self.current_chats_list[chat_id] = chatbox;

            }

            var chat = self.current_chats_list[chat_id];
            var time = new Date();
            chat.write_chat_line({
                name: data.username,
                time: time.getHours() + ":" + time.getMinutes(),
                text: data.text
            });
        });
    },
    focus_chat_box: function(chat_id){
        $('.chat-box').css('display', 'none');

        $('.chat-box[chat_id="' + chat_id + '"]').css('display', 'block');

    },
    send_msg: function(msg_data){
        var self = this;
        console.log('sending message');
        self.socket.emit('send_msg', msg_data);
    }
};