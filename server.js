var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

io.on('connection', function (socket) {
    console.log('Client connected');

    socket.on('username', function (username) {
        console.log('Who just got online?', username);
        socket.broadcast.emit('username', username);
    });

    socket.on('usernames', function (usernames) {
        console.log('Who is online?', usernames);
        socket.broadcast.emit('usernames', usernames);
    });

    socket.on('message', function (message) {
        console.log('Received message:', message);
        socket.broadcast.emit('message', message);
    });

    socket.on('error', function (error) {
        console.log('What is the error? --', error);
    });

    socket.on('disconnect', function (username) {
        console.log(username, 'has disconnected');
    });
});

server.listen(8080);
