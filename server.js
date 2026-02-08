const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve your static HTML/CSS/JS files
app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for chat messages
    socket.on('chatMessage', (msg) => {
        // Broadcast to everyone else (Simple 1-to-1 logic)
        socket.broadcast.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
