$(document).ready(function () {
    //global variables
    var socket = io();
    var input = $('input');
    var messages = $('#messages');

    var addMessage = function (message) {
        messages.append('<div>' + message + '</div>');
    };

    //When user connects and/or disconnects show that the user connected/disconnected

    //Show who is online

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
