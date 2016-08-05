$(document).ready(function () {
    //global variables
    var username = prompt('Enter your username');
    var usernames = [];
    var socket = io();
    var input = $('input');
    var messages = $('#messages');
    var userInRoom = $('#whosintheroom');
    var typing = $('#useristyping');
    var room = 'general';

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

    //function to show user is typing message
    var userTyping = function (usernames) {
        typing.html(username + ' is typing...');
    };

    //function that removes user is typing message
    var userNotTyping = function (usernames) {
        typing.remove();
    };

    // UI to show who connected to the room
    var userConnected = function (usernames) {
        userInRoom.append('<h3>' + username + ' has connected!</h3>');
    };

    //user disconnected message
    var userDisconnected = function (usernames) {
        userInRoom.append('<h3>' + username + ' has disconnected!</h3>');
    };

    socket.on('connect', function (usernames) {
        socket.emit('username', userConnected);
        userConnected(username);
        console.log('who\'s in the room?', usernames);
    });

    socket.on('users', userConnected);

    input.on('keydown', function (event, userTyping, userNotTyping) {
        //emit message that the user is typing if enter is not pressed
        socket.emit('typing', userTyping);
        //when user is typing, ignore everything until they hit enter
        if (event.keyCode != 13) {
            return;
        } else {
            //once enter is pressed remove the message that user is typing
            socket.emit('notTyping', userNotTyping);

        }

        //until the user hits enter, the message value is taken in from the input box and the socket emits the object (message and username)
        var message = input.val();
        addMessage(message);
        socket.emit('message', {
            message: message,
            username: username
        });
        input.val('');
    });
    socket.on('typing', userTyping);
    socket.on('notTyping', userNotTyping);
    //message is added onto the page
    socket.on('message', addMessage);

    socket.on('disconnect', function (username) {
        socket.emit('username', userDisconnected);
        userDisconnected(username);

    });
    socket.on('username', userDisconnected);
});
