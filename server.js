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

    socket.on('connect', function (room) {
        console.log('User joined', room);
        socket.broadcast.emit('User joined ', room);
    });

    socket.on('userConnect', function (username) {
        usernames.push(username);
        //        console.log('User connected', username);
        socket.broadcast.emit('users', usernames);
    });

    socket.on('message', function (message) {
        console.log('Received message:', message);
        socket.broadcast.emit('message', message);
    });
    //remove usernames from array (array manipulation)
    socket.on('disconnect', function (room) {
        console.log('User left', room);
        socket.broadcast.emit('User left ', room);
    });
});

server.listen(8080);
