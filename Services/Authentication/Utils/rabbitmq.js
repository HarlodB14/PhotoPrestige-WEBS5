import amqp from 'amqplib';

const RABBITMQ_URL = 'amqp://admin:secret@rabbitmq:5672';
let connection = null;
let channel = null;

// List of queues to declare at startup
const QUEUES = [
    'user_registered',
    'user_registered_DLQ',
    'user_logged_in'
];

async function initRabbitMQ() {
    try {
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();

        // Declare all queues at startup
        for (const queue of QUEUES) {
            await channel.assertQueue(queue, {
                durable: true,
                ...(queue.endsWith('_DLQ') ? {} : {
                    arguments: {
                        'x-dead-letter-exchange': '',
                        'x-dead-letter-routing-key': `${queue}_DLQ`
                    }
                })
            });
            console.log(`Declared queue: ${queue}`);
        }

        connection.on('error', (err) => {
            console.error('RabbitMQ connection error:', err);
            reconnect();
        });

        channel.on('error', (err) => {
            console.error('RabbitMQ channel error:', err);
            reconnect();
        });

        console.log('RabbitMQ connected and queues declared');
    } catch (error) {
        console.error('RabbitMQ initialization error:', error);
        reconnect();
    }
}

function reconnect() {
    if (connection) {
        try {
            connection.close();
        } catch (e) {
            console.error('Error closing connection:', e);
        }
    }
    connection = null;
    channel = null;
    setTimeout(initRabbitMQ, 5000);
}

// Initialize on startup
initRabbitMQ();

export async function publishToQueue(queueName, data) {
    try {
        console.log('Attempting to publish to RabbitMQ...'); // Add this line
        console.log('Current channel state:', channel ? 'Connected' : 'Not connected'); // Add this line
        if (!channel) {
            console.log('No channel available, initializing...');
            await initRabbitMQ();
            if (!channel) new Error('Failed to initialize RabbitMQ');
        }

        await channel.assertQueue(queueName, {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': '',
                'x-dead-letter-routing-key': `${queueName}_DLQ`
            }
        });

        const sent = channel.sendToQueue(
            queueName,
            Buffer.from(JSON.stringify(data)),
            {persistent: true}
        );

        if (!sent) {
            new Error(`Message not sent to ${queueName} (probably due to backpressure)`);
        }

        console.log(`Published to ${queueName}:`, data);
        return true;
    } catch (error) {
        console.error('Full error details:', { // Enhanced error logging
            error: error.message,
            stack: error.stack,
            queueName,
            data
        });
        throw error;
    }
}