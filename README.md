# Real-Time Updates with Node.js, Kafka, and WebSockets

This repository demonstrates two approaches to implement real-time updates using:
- Node.js
- Apache Kafka
- WebSockets

## Prerequisites
- Node.js 16+
- npm/yarn
- Java 8+ (for Kafka)
- Apache Kafka (or Docker for Kafka setup)
- Ports available: 2181 (Zookeeper), 9092 (Kafka), 3000 (WebSocket), 8000 (Client)

## Architecture Options

### 1. Basic Setup (Separate Services)
```
Producer → Kafka → Consumer → WebSocket Server → Client
```

### 2. Express Setup (Integrated Server)
```
Producer → Kafka → Express Server (Consumer + WebSocket) → Client
```

## Quick Start

### For Basic Setup (Separate Services):

```bash
# Clone repository
git clone https://github.com/yourusername/real-time-updates.git
cd real-time-updates

# Install dependencies
cd producer && npm install
cd ../consumer-websocket && npm install
cd ../client && npm install

# Start Zookeeper and Kafka (in separate terminals)
# Follow Kafka setup instructions from previous steps

# Create Kafka topic
kafka-topics.sh --create --topic real-time-updates --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1

# Start services in different terminals
node producer/index.js
node consumer-websocket/index.js
cd client && http-server -p 8000
```

### For Express Setup (Integrated Server):

```bash
cd express-server
npm install
npm start

# In separate terminal
node ../producer/index.js

# Access client at http://localhost:3000
```

## Directory Structure

### Basic Setup
```
.
├── producer/               # Kafka producer
├── consumer-websocket/     # Kafka consumer + WebSocket
└── client/                 # Frontend client
```

### Express Setup
```
.
├── producer/               # Kafka producer
└── express-server/
    ├── src/
    │   ├── client/         # Frontend files
    │   ├── kafka-consumer.js
    │   └── server.js       # Express + WebSocket server
    └── package.json
```

## Environment Setup

### 1. Kafka Configuration
- Download Kafka from [https://kafka.apache.org/downloads](https://kafka.apache.org/downloads)
- Or use Docker:
  ```bash
  docker-compose up -d
  ```

### 2. Required Ports
| Service       | Port  |
|---------------|-------|
| Zookeeper     | 2181  |
| Kafka         | 9092  |
| WebSocket     | 3000  |
| Client Server | 8000  |

## Key Commands

### Producer
```bash
node producer/index.js
```

### Consumer + WebSocket (Basic)
```bash
node consumer-websocket/index.js
```

### Express Server
```bash
npm start
# Accessible at http://localhost:3000
```

### Client
```bash
# For basic setup
cd client && http-server -p 8000

# For Express setup (already included)
open http://localhost:3000
```

## Testing the Flow

1. Verify Kafka messages:
```bash
kafka-console-consumer.sh --topic real-time-updates --bootstrap-server localhost:9092 --from-beginning
```

2. Test WebSocket directly:
```bash
npx wscat -c ws://localhost:3000
```

3. Verify Express server health:
```bash
curl http://localhost:3000/health
```

## Troubleshooting

### Common Issues
1. **Kafka not running**:
   - Verify Zookeeper and Kafka processes
   - Check `logs/` directory for errors

2. **Port conflicts**:
   ```bash
   lsof -i :2181 # Check Zookeeper port
   lsof -i :9092 # Check Kafka port
   ```

3. **WebSocket connection issues**:
   - Check browser console for errors
   - Verify CORS settings in server

4. **Missing topics**:
   ```bash
   kafka-topics.sh --list --bootstrap-server localhost:9092
   ```

## Flow Explanation

1. **Producer** sends messages to Kafka every 2 seconds
2. **Consumer**:
   - Connects to Kafka
   - Subscribes to `real-time-updates` topic
   - Forwards messages to WebSocket
3. **Client**:
   - Connects to WebSocket
   - Displays real-time updates
   - Auto-scrolls to new messages

## Frontend Update Screenshot

![Frontend Update](screenshots/Screenshot%202025-03-13%20022205.png)

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/fooBar`)
3. Commit changes (`git commit -am 'Add some fooBar'`)
4. Push to branch (`git push origin feature/fooBar`)
5. Create new Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details
