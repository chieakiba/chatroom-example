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

    socket.on('connect', function (username, room) {
        usernames.push(username);
        socket.broadcast.emit(username, 'left', room);
    });

    console.log('show me the list of usernames', usernames);

    socket.on('typing', function (userTyping) {
        console.log('User is typing', userTyping);
        socket.broadcast.emit('typing', userTyping);
    })

    socket.on('notTyping', function (userNotTyping) {
        console.log('User is not typing', userNotTyping);
        socket.broadcast.emit('Not typing', userNotTyping);
    });

    socket.on('message', function (message) {
        console.log('Received message:', message);
        socket.broadcast.emit('message', message);
    });
    //remove usernames from array (array manipulation)
    socket.on('disconnect', function (username, room) {
        console.log(username, ' left', room);
        socket.broadcast.emit(username, ' left ', room);
    });
});

server.listen(process.env.PORT || 8080);
