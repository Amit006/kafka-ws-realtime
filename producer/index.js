const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});

const producer = kafka.producer({
  createPartitioner: () => ({ partition }) => 0, // Force partition 0
  allowAutoTopicCreation: true
});

const sendMessage = async () => {
  await producer.connect();
  
  setInterval(async () => {
    await producer.send({
      topic: 'real-time-updates',
      messages: [
        { value: `Update at ${new Date().toISOString()}` }
      ],
    });
    console.log('Message sent');
  }, 2000);
};

sendMessage().catch(console.error);