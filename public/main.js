$(document).ready(function () {
    //global variables
    var socket = io();
    var usersInRoom = $('#usersInRoom');
    var addUsers = function (username) {
        usersInRoom.append('<div>' + username + ' is online!' + '</div>');
    };
    var input = $('input');
    var messages = $('#messages');
    var username = prompt('Please enter your name');
    var allTheUsers = [];

    var addMessage = function (message) {
        messages.append('<div>' + message + '</div>');
    };

    //Using socket emitter to emit username once entered in the prompt
    socket.emit('username', username);
    addUsers(username);
    socket.on('username', addUsers);

    //Emit each usernames to the server side and once broadcasted, push those names into the array
    socket.on('username', function (data) {
        allTheUsers.push(data);
        console.log('Are all the users in this array?', allTheUsers);
    });

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
