$(document).ready(function () {
    var username = prompt('Enter your username');
    var socket = io();
    var input = $('input');
    var messages = $('#messages');

    var addMessage = function (message) {
        if (typeof message == 'object') {
            console.log('message', message);

            messages.append('<div>' + message.username + ": " + message.message + '</div>');
        } else {
            console.log('message', message);

            messages.append('<div>' + username + ": " + message + '</div>');
        }

    };

    var userConnected = function (username) {
        messages.html('<div>' + username + ' has connected!</div>');
    };

    var userDisconnected = function (username) {
        messages.html('<div>' + username + ' has disconnected!</div>');
    };

    var room = 'General';

    socket.on('connect', function () {
        socket.emit('userConnect', username);
        console.log('User joined', room);
    });

    socket.on('users', function (usernames) {
        console.log('Username(s) joined the chat', usernames);
    });

    input.on('keydown', function (event) {
        if (event.keyCode != 13) {
            return;
        }

        var message = input.val();
        addMessage(message);
        socket.emit('message', {
            message: message,
            username: username
        });
        input.val('');

    });
    socket.on('message', addMessage);

    socket.on('disconnect', function (room) {
        console.log('User left', room);
        socket.emit(username, ' left ', room);
        socket.on('username', userDisconnected);
    });
});
