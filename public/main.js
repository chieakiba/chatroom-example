$(document).ready(function () {
    var socket = io();
    var input = $('input');
    var messages = $('#messages');

    var addMessage = function (message) {
        messages.append('<div>' + message + '</div>');
    };

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
