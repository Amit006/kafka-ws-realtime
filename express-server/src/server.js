const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { setupConsumer } = require('./kafka-consumer');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static('src/client'));

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start Kafka consumer
setupConsumer(io);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
  console.log(`Client: http://localhost:${PORT}`);
});