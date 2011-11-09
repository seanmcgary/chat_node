var chat_box_template = '<div class="chat-box" chat_id="{{chat_id}}">' +
                            '<div class="chat-text">' +
                            '</div>' +
                            '<div class="chat-input">' +
                                '<div class="chat-submit">' +
                                    '<input type="submit">' +
                                '</div>' +
                                '<div class="text-box">' +
                                    '<textarea username="{{username}}" chat_id="{{chat_id}}" name="chat-message" class="chat-message"></textarea>' +
                                '</div>' +
                            '</div>' +
                        '</div>';

var tab_template = '<li chat_id="{{chat_id}}">' +
                        '<div class="text">' +
                            '{{username}}' +
                        '</div>' +
                        '<div class="close">' +
                            'x' +
                        '</div>' +
                    '</li>';

function ChatBox(chat_session, contact, chat_id){
    var self = this;
    self.contact = contact;

    self.chat_session = chat_session;
    self.chat = null;
    self.chat_id = chat_id;

    self.is_current = false;
    
    self.render_box();
}

ChatBox.prototype = {
    init: function(){

    },
    render_box: function(){
        var self = this;

        self.chat = $(Mustache.to_html(chat_box_template, {chat_id: self.chat_id, username: self.contact.username}));

        self.chat_session.current_chats.append(self.chat);

        self.draw_tab();

        self.chat_session.focus_chat_box(self.chat_id);

        self.resize_chat();

        self.bind_listeners();
    },
    resize_chat: function(){
        var self = this;

        if(self.chat != null){
            self.chat_text = self.chat.find('.chat-text');
            self.chat_input = self.chat.find('.chat-input');

            self.chat_text.css('height', (self.chat.get(0).offsetHeight - self.chat_input.get(0).offsetHeight - 40) + 'px');

        }
    },
    /**
     * chat_data
     *  - name
     *  - time
     *  - text
     * @param chat_data
     */
    write_chat_line: function(chat_data){
        var self = this;
        var template = '<div class="chat-line">' +
                             '<div class="chat-meta">{{name}} ({{time}})</div> {{{text}}}' +
                         '</div>';

        if(self.chat != null){
            var msg = Mustache.to_html(template, chat_data);
            self.chat_text.append(msg);
        }
    },
    draw_tab: function(){
        var self = this;

        var tab = $(Mustache.to_html(tab_template, {chat_id: self.chat_id, username: self.contact.username}));

        tab.click(function(event){
            var chat_id = $(this).attr('chat_id');
            console.log(chat_id);

            self.chat_session.focus_chat_box(chat_id);
        });

        self.chat_session.chat_tabs_list.append(tab);
    },
    bind_listeners: function(){
        var self = this;

        $('textarea[chat_id="' + self.chat_id + '"]').keypress(function(event){

            if(event.which == 13 && event.shiftKey == false){
                event.preventDefault();

                var chat_id = $(this).attr('chat_id');
                var msg = $(this).val();
                var to_user = $(this).attr('username');
                console.log('here');

                self.chat_session.send_msg({chat_id: chat_id, msg: msg, to_user: to_user});

            }

        });

    }

};