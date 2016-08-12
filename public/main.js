$(document).ready(function () {
    //global variables
    var socket = io();
    var input = $('input');
    var messages = $('#messages');
    var username = prompt('Please enter your name');
    var usernames = [];

    var addMessage = function (message) {
        messages.append('<div>' + message + '</div>');
    };

    //When user connects and/or disconnects show that the user connected/disconnected

    //Show who is online

    //Push users into the usernames array as they enter their names into the prompt
    usernames.push(username);

    //When user is typing, show that the user is typing

    input.on('keydown', function (event) {
        if (event.keyCode != 13) {
            return;
        }

        var message = input.val();
        socket.emit('message', message);
        addMessage(message);
        input.val('');
    });
    socket.on('message', addMessage);
});
