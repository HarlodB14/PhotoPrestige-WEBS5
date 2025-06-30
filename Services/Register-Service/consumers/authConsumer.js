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

        //Use the same DLQ settings as the producer (authentication service)
        await channel.assertQueue('user_registered', {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': '',
                'x-dead-letter-routing-key': 'user_registered_DLQ'
            }
        });

        await channel.assertQueue('user_registered_DLQ', {durable: true});

        console.log('Listening for auth events...');

        await channel.consume('user_registered', async (msg) => {
            if (!msg) return;

            try {
                const message = JSON.parse(msg.content.toString());
                console.log('Received message:', message);

                // Simulated delay for debugging
                await new Promise(resolve => setTimeout(resolve, 30000));

                await processUserRegistration(message);
                channel.ack(msg);
            } catch (error) {
                console.error('Processing failed, sending to DLQ:', error);
                channel.nack(msg, false, false);
            }
        });

        // Reconnect on connection errors
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