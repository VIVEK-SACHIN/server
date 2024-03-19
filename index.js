const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');
// const cors = require('cors');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);

    });
    socket.on("join", (room) => {

        socket.join(room);
        console.log(room + " room joined");
    });
    socket.on("senddouble", (msg) => {
        console.log("senddouble event trigger ");
        
        // socket.broadcast.emit('roomMessage', msg + "  socket.broadcast");
        io.in("double").emit('roomMessage', msg + " io.in");
        io.to("double").emit('roomMessage', msg + "  io.to");
        socket.to("double").emit('roomMessage', msg + "  socket.to");
        socket.emit('roomMessage', msg + "  socket.emit");
    });
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
