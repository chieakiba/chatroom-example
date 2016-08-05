var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var usernames = [];

io.on('connection', function (socket) {
    console.log('Client connected');

    socket.on('connect', function (username, userConnected) {
        usernames.push(username);
        console.log('who\'s in the room?', usernames);
        socket.broadcast.emit(username, userConnected);
    });
    //    console.log('who\'s in the room?', usernames);

    socket.on('typing', function (userTyping) {
        console.log('User is typing', userTyping);
        socket.broadcast.emit('typing', userTyping);
    });

    socket.on('notTyping', function (userNotTyping) {
        console.log('User is not typing', userNotTyping);
        socket.broadcast.emit('Not typing', userNotTyping);
    });

    socket.on('message', function (message) {
        console.log('Received message:', message);
        socket.broadcast.emit('message', message);
    });
    //remove usernames from array (array manipulation)
    socket.on('disconnect', function (username, userDisconnected) {
        socket.broadcast.emit(username, userDisconnected);
    });

    socket.on('error', function (error) {
        console.log('Socket error! Something isn\'t working!' + error);
        socket.broadcast.emit(error);
    });
});

server.listen(process.env.PORT || 8080);
