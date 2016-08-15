var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

io.on('connection', function (socket) {
    console.log('Client connected');

    //Listens to client side username prompt entries
    socket.on('username', function (username) {
        console.log('Who just got online?', username);
        socket.broadcast.emit('username', username);
    });

    //Listens to client side emit to push all the usernames into an array and show it on the page
    socket.on('allTheUsers', function (prettyUsers) {
        console.log('Checking the array', prettyUsers);
        socket.broadcast.emit('allTheUsers', prettyUsers);
    });

    //Listens to client side emit for when user sends a message
    socket.on('message', function (messageObject) {
        console.log('Received message:', messageObject);
        socket.broadcast.emit('message', messageObject);
    });

    //Listens to client side emit for when user is typing
    socket.on('typing', function (typing) {
        console.log('Typing?', typing);
        socket.broadcast.emit('typing', typing);
    });

    //Shows error message on the terminal
    socket.on('error', function (error) {
        console.log('What is the error? --', error);
    });

});

server.listen(process.env.PORT || 8080);
