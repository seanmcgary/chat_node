var chat_box_template = '<div class="chat-box">' +
                            '<div class="chat-text">' +
                            '</div>' +
                            '<div class="chat-input">' +
                                '<div class="chat-submit">' +
                                    '<input type="submit">' +
                                '</div>' +
                                '<div class="text-box">' +
                                    '<textarea name="chat-message" class="chat-message"></textarea>' +
                                '</div>' +
                            '</div>' +
                        '</div>';

function ChatBox(chat_session, contact){
    var self = this;
    self.contact = contact;

    self.chat_session = chat_session;
    self.chat = null;
    
    self.render_box();
}

ChatBox.prototype = {
    init: function(){

    },
    render_box: function(){
        var self = this;

        self.chat = $(Mustache.to_html(chat_box_template));

        self.chat_session.current_chats.append(self.chat);

        self.resize_chat();
    },
    resize_chat: function(){
        var self = this;

        if(self.chat != null){
            var chat_text = self.chat.find('.chat-text');
            var chat_input = self.chat.find('.chat-input');

            console.log(self.chat.get(0).offsetHeight);

            chat_text.css('height', (self.chat.get(0).offsetHeight - chat_input.get(0).offsetHeight - 40) + 'px');

            console.log(self.chat);
        }
    },
    bind_listeners: function(){
        var self = this;

        if(self.chat != null){
            
        }
    }

};