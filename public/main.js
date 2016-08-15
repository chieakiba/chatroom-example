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


    var addMessage = function (username, message) {
        messages.append('<div>' + username + ': ' + message + '</div>');
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

        //Append the list of users on the page
        addUsers(allTheUsers);

        //Emit the array to the server
        socket.emit('allTheUsers', allTheUsers);
    });

    //Show who is online
    socket.on('allTheUsers', function (data) {
        addUsers(data);
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
        addMessage(username, message);
        //Emit socket to server side so when user sends a message, the user will know who sent that message
        socket.emit('message', {
            username: username,
            message: message
        });
        input.val('');

    });
    socket.on('message', function (data) {
        addMessage(data);
        socket.emit('messageToAll', data);
        socket.on('messageToAll', addMessage);
        console.log('Is this the object literal?', data);
    });



});
