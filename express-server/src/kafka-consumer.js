const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'express-app',
  brokers: ['localhost:9092']
});

exports.setupConsumer = (io) => {
  const consumer = kafka.consumer({ 
    groupId: 'express-group',
    fromBeginning: true
  });

  const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'real-time-updates' });

    await consumer.run({
      eachMessage: async ({ message }) => {
        const payload = {
          timestamp: Date.now(),
          message: message.value.toString()
        };
        console.log('Forwarding message:', payload);
        io.emit('update', payload);
      },
    });
  };

  run().catch(console.error);
};