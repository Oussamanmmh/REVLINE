const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const app = require('./app');

// Initialize HTTP server and Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*', 
        methods: ['GET', 'POST'],
    },
});

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('WebSocket connection established');

   
    socket.on('message', (data) => {
        console.log('Message received:', data);
        socket.emit('response', { message: 'Message received!' });
    });

    socket.on('disconnect', () => {
        console.log('WebSocket connection disconnected');
    });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
