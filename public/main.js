$(document).ready(function () {
    //global variables
    var timeout;
    var socket = io();
    var usersInRoom = $('#usersInRoom');
    var addUsers = function (username) {
        usersInRoom.html('<div>' + username + '</div></br>');
    };
    var input = $('input');
    var messages = $('#messages');
    var username = prompt('Please enter your name');
    var allTheUsers = [];

    //Appends the message on page with username. Checks that it is an object
    var addMessage = function (message) {
        if (typeof message == 'object') {
            console.log('message', message);
            messages.append('<div>' + message.username + ": " + message.message + '</div>');
        } else {
            console.log('message', message);
            messages.append('<div>' + username + ": " + message + '</div>');
        }
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

        //Add whitespaces between usernames so it looks nice
        allTheUsers.split('');
        var prettyUsers = new Array();
        for (var i = 0; i < allTheUsers.length; i++) {
            prettyUsers.push(allTheUsers[i]);
            if (i != allTheUsers.length - 1) {
                prettyUsers.push('');
            }
        }

        //Append the list of users on the page
        addUsers(prettyUsers);

        //Emit the array to the server
        socket.emit('allTheUsers', prettyUsers);
    });

    //Show who is online
    socket.on('allTheUsers', function (data) {
        addUsers(data);
        console.log('Who\'s in the room?', data);
    });

    //Function that emits message to the server side socket that the user is not typing
    function timeoutFunction() {
        typing = false;
        socket.emit('typing', false);
    };

    //When user is typing, the client side emits a socket to the server side so it will broadcast who is typing
    input.on('keyup', function () {
        console.log('User is typing something...');
        typing = true;
        socket.emit('typing', {
            username: username,
            typing: typing
        });
        clearTimeout(timeout); //clears out the message when a certain amount of time passes after the user stops typing
        timeout = setTimeout(timeoutFunction, 1000);
    });

    //Listens to the server side broadcast and adds the username and the message "is typing..."
    socket.on('typing', function (data) {
        if (data.typing == true) {
            $('#userTyping').html(data.username + ' is typing...');
        } else { //otherwise removes the "is typing..." message
            $('#userTyping').html('');
        }
    });

    //Keydown event
    input.on('keydown', function (event) {
        if (event.keyCode != 13) { //If user did not hit enter, it keeps on letting the user type without doing anything
            return;
        }

        var message = input.val();
        addMessage(message);

        //Emit socket to server side so when user sends a message, the user will know who sent that message
        socket.emit('message', {
            username: username,
            message: message
        });
        input.val('');

    });

    //Listens to the broadcast emited from the server side so it appends the username and data to the chatroom
    socket.on('message', function (data) {
        addMessage(data);
        console.log('Is this the object literal?', data);
    });
});
