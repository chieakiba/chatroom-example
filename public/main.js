$(document).ready(function () {
    //global variables
    var socket = io();
    var usersInRoom = $('#usersInRoom');
    var input = $('input');
    var messages = $('#messages');
    var username = prompt('Please enter your name');
    var usernames = [];

    var addMessage = function (message) {
        messages.append('<div>' + message + '</div>');
    };

    //Socket emitter to emit username once entered in the prompt
    socket.emit('username', username);
    socket.on('username', function (data) {
        usersInRoom.append(data + ' is online!');
    });
    //When user connects and/or disconnects show that the user connected/disconnected

    //Show who is online

    //Push users into the usernames array as they enter their names into the prompt
    usernames.push(username);
    console.log('List of users:', usernames);

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
