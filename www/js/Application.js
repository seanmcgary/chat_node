$(document).ready(function(){
    var socket = io.connect('http://localhost:8080');
    var chat_session = new ChatSession($('#chat'), socket);

    $('#chat-login').live('submit', function(){

        var creds = {};

        creds.username = $('#username').val();
        creds.password = $('#password').val();
        chat_session.authenticate_user(creds);
        return false;
    });

});