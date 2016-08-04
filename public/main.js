$(document).ready(function () {
    var username = prompt('Enter your username');
    var usernames = [];
    var socket = io();
    var input = $('input');
    var messages = $('#messages');
    var userInRoom = $('#whosintheroom');
    var typing = $('#useristyping');

    var addMessage = function (message) {
        if (typeof message == 'object') {
            console.log('message', message);

            messages.append('<div>' + message.username + ": " + message.message + '</div>');
        } else {
            console.log('message', message);

            messages.append('<div>' + username + ": " + message + '</div>');
        }
    };

    var userTyping = function (usernames) {
        typing.html(username + ' is typing...');
    };

    var userNotTyping = function (usernames) {
        typing.remove();
    };

    // UI to show who is in the room
    var userConnected = function (usernames) {
        userInRoom.append('<h3>' + username + ' has connected!</h3>');
    };

    var userDisconnected = function (usernames) {
        userInRoom.append('<h3>' + username + ' has disconnected!</h3>');
    };

    var room = 'general';

    socket.on('connect', function (username, room) {
        socket.emit('username', userConnected);
        userConnected(username);

    });
    socket.on('username', userConnected);

    input.on('keydown', function (event) {
        if (event.keyCode != 13) {

            return;
        }
        // else {
        //send message that says user is typing
        //once user key ups, remove the message
        //        }

        var message = input.val();
        addMessage(message);
        socket.emit('message', {
            message: message,
            username: username
        });
        input.val('');
    });

    socket.on('message', addMessage);

    socket.on('disconnect', function (username, room) {
        console.log(username, 'left', room);
        socket.emit(username, 'left', room);
        userDisconnected(username);

    });
    socket.on('username', userDisconnected);
});
