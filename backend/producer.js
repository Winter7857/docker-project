const amqp = require('amqplib/callback_api');
// RabbitMQ connection details
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:1234@localhost:5672';
const QUEUE_NAME = 'task_queuej';

// Connect to RabbitMQ
amqp.connect(RABBITMQ_URL, (err, connection) => {
    if (err) {
      console.error('RabbitMQ connection error:', err);
      return;
    }
  
    connection.createChannel((err, channel) => {
      if (err) {
        console.error('RabbitMQ channel creation error:', err);
        return;
      }
  
      channel.assertQueue(QUEUE_NAME, { durable: true });
  
      // Example: Publish a message to the queue
      app.post('/api/publish', (req, res) => {
        const message = 'Default Message';
        channel.sendToQueue(QUEUE_NAME, Buffer.from(message), { persistent: true });//string to binary
        console.log(`Message sent to queue: ${message}`);
        res.status(200).send({ success: true, message });
     });
    });
  });
  
  

