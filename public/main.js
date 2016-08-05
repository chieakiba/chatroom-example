$(document).ready(function () {
    //global variables
    var username = prompt('Enter your username');
    var usernames = [];
    var socket = io();
    var input = $('input');
    var messages = $('#messages');
    var userInRoom = $('#whosintheroom');
    var typing = $('#useristyping');

    //function for adding messages
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

    socket.on('connect', function (usernames) {
        socket.emit('username', userConnected);
        userConnected(username);
        console.log('who\'s in the room?', usernames);
    });

    socket.on('users', userConnected);



    input.on('keydown', function (event) {
        if (event.keyCode === 13) {
            socket.emit('notTyping', userNotTyping);
            socket.on('notTyping', userNotTyping);
            //            return;
        } else {
            socket.emit('typing', userTyping);
            socket.on('typing', userTyping);
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

    socket.on('disconnect', function (username) {
        socket.emit('username', userDisconnected);
        userDisconnected(username);

    });
    socket.on('username', userDisconnected);
});
