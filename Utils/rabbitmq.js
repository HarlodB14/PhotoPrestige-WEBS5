// utils/rabbitmq.js
import amqp from 'amqplib';

const RABBITMQ_URL = 'amqp://admin:secret@rabbitmq:5672';
let channel = null;

export async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
        return channel;
    } catch (error) {
        console.error('RabbitMQ connection error:', error);
        throw error;
    }
}

export async function publishToQueue(queueName, data) {
    if (!channel) await connectRabbitMQ();

    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(data)),
        { persistent: true }
    );
    console.log(`[x] Sent to ${queueName}:`, data);
}