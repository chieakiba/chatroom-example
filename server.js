var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

io.on('connection', function (socket) {
    console.log('Client connected');

    socket.on('userConnected', function (username) {
        console.log(username, 'has connected');
    });

    socket.on('username', function (username) {
        console.log('Who just got online?', username);
        socket.broadcast.emit('username', username);
    });

    socket.on('allTheUsers', function (allTheUsers) {
        console.log('Checking the array', allTheUsers);
        socket.broadcast.emit('allTheUsers', allTheUsers);
    });

    socket.on('message', function (data) {
        console.log('Received message:', data);
        socket.broadcast.emit('message', data);
    });

    socket.on('error', function (error) {
        console.log('What is the error? --', error);
    });

    socket.on('userDisconnected', function (username) {
        console.log(username, 'has disconnected');
    });
});

server.listen(8080);
