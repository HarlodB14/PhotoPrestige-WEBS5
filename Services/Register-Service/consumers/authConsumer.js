import amqp from 'amqplib';
import UserProfile from '../models/Registration.js';

const RABBITMQ_URL = 'amqp://admin:secret@rabbitmq:5672';

async function processUserRegistration(message) {
    try {
        const {userId, email, username, role} = message;

        await UserProfile.create({
            authUserId: userId,
            email,
            username,
            role,
            eventsRegistered: [],
            lastUpdated: new Date()
        });

        console.log(`Created user profile for ${userId}`);
    } catch (error) {
        console.error('Failed to process user registration:', error);
        throw error;
    }
}

async function startAuthConsumer() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        // Set up queues with DLQ
        await channel.assertQueue('user_registered', {durable: true});
        await channel.assertQueue('user_registered_DLQ', {durable: true});

        console.log(' Listening for auth events...');

        await channel.consume('user_registered', async (msg) => {
            if (!msg) return;

            try {
                console.log('Received message:', msg.content.toString());

                const message = JSON.parse(msg.content.toString());
                console.log('Received message:', msg.content.toString());  // Add this line
                await new Promise(resolve => setTimeout(resolve, 30000)); // 30-second delay
                await processUserRegistration(message);
                channel.ack(msg);
            } catch (error) {
                console.error('Processing failed, sending to DLQ:', error);
                channel.nack(msg, false, false);
            }
        });

        //exceptions
        connection.on('error', (err) => {
            console.error('RabbitMQ connection error:', err);
            setTimeout(startAuthConsumer, 5000);
        });

    } catch (error) {
        console.error('Failed to start consumer:', error);
        setTimeout(startAuthConsumer, 5000);
    }
}

startAuthConsumer();