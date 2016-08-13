$(document).ready(function () {
    //global variables
    var socket = io();
    var usersInRoom = $('#usersInRoom');
    var addUsers = function (username) {
        usersInRoom.append('<div>' + username + '</div></br>');
    };
    var input = $('input');
    var messages = $('#messages');
    var username = prompt('Please enter your name');
    var allTheUsers = [];

    var addMessage = function (message) {
        messages.append('<div>' + message + '</div>');
    };

    var userDisconnected = function (username) {
        messages.append('<div>' + username + ' has disconnected!</div>');
    };

    var userConnected = function (username) {
        messages.append('<div>' + username + ' has connected!</div>');
    };

    //Using socket emitter to emit username once entered in the prompt
    socket.emit('username', username);

    //Pushes the username into the array once user enters their handle name into the prompt
    allTheUsers.push(username);

    //Emit each usernames to the server side and once broadcasted, append the usernames onto the page and push those names into the array
    socket.on('username', function (data) {
        allTheUsers.push(data);
        console.log('Who is this?', data);
        console.log('What\'s in the array?', allTheUsers);
        addUsers(allTheUsers);
    });

    //Show who is online
    socket.emit('allTheUsers', addUsers);
    socket.on('allTheUsers', function (data) {
        console.log('Who\'s in the room?', data);
    });


    //When user connects, show that the user connected/disconnected
    //    socket.emit('userConnected', userConnected);
    //    userConnected(username);
    //    socket.on('userConnected', userConnected);

    //When user disconnects, show that the user connected/disconnected
    //    socket.emit('userDisconnected', userDisconnected);
    //    userDisconnected(username);
    //    socket.on('userDisconnected', userDisconnected);

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
