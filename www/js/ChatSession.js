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
        self.chat_container = $('<div class="chat-container"></div>');

        self.container_elem.append(self.chat_tabs);
        self.container_elem.append(self.chat_container);

        self.contact_list = new ContactList(self);

        self.current_chats = $('<div class="current-content"></div>');

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
        });
    },
    setup_listeners: function(){

    }
};