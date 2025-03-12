const { Kafka } = require('kafkajs');
const { Server } = require('socket.io');
const http = require('http');

// WebSocket setup
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Kafka setup
const kafka = new Kafka({
  clientId: 'websocket-consumer',
  brokers: ['localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

const consumer = kafka.consumer({ 
  groupId: 'websocket-group',
  fromBeginning: true,  // Read from start
  allowAutoTopicCreation: true,
  sessionTimeout: 30000,
  heartbeatInterval: 3000
});

// Track connected clients
let connectedClients = 0;

// Socket.io connection handling
io.on('connection', (socket) => {
  connectedClients++;
  console.log(`Client connected. Total clients: ${connectedClients}`);
  
  socket.on('disconnect', () => {
    connectedClients--;
    console.log(`Client disconnected. Total clients: ${connectedClients}`);
  });
});

const run = async () => {
  try {
    // Connect to Kafka
    console.log('Connecting to Kafka...');
    await consumer.connect();
    console.log('Connected to Kafka');
    
    // Subscribe to topic
    await consumer.subscribe({ 
      topic: 'real-time-updates',
      fromBeginning: false
    });
    console.log('Subscribed to topic: real-time-updates');

    // Process messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = message.value.toString();
          console.log(`Received message: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
          console.log(`Received message from ${topic}[${partition}]: ${message.value}`);
          // Broadcast to all connected clients
          io.emit('update', value);
        } catch (err) {
          console.error('Error processing message:', err);
        }
      },
    });
  } catch (error) {
    console.error('Error in Kafka consumer:', error);
  }
};

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down...');
  try {
    await consumer.disconnect();
    console.log('Kafka consumer disconnected');
    
    server.close(() => {
      console.log('WebSocket server closed');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle termination signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the server
server.listen(3000, () => {
  console.log('WebSocket server listening on *:3000');
  run().catch(error => {
    console.error('Failed to start Kafka consumer:', error);
    shutdown();
  });
});
