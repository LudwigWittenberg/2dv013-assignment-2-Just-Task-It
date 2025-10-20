import amqp from "amqplib/callback_api.js";
import { logger } from "./winston.js";

let channel;

async function connectRabbitMq(connectionString) {
	logger.info("Connecting to RabbitMQ");
	return new Promise((resolve, reject) => {
		amqp.connect(connectionString, function createChannel(error0, connection) {
			if (error0) {
				console.log(error0);
				throw error0;
			}

			connection.on("error", (err) => logger.info("RabbitMQ conn error:"));

			connection.on("close", () => {
				logger.info("RabbitMQ conn closed");
				channel = undefined;
			});

			logger.info("RabbitMQ connected");

			connection.createChannel(function (error1, innerChannel) {
				if (error1) {
					throw error1;
				}

				channel = innerChannel;

				resolve(connection);
			});
		});
	});
}

function sendRabbitMessage(msg) {
	if (!channel) {
		throw new Error("Rabbit is not ready yes");
	}

	const QUEUE = process.env.RABBIT_QUEUE;

	channel.assertQueue(QUEUE, {
		durable: true,
		arguments: {
			"x-queue-type": "quorum",
		},
	});

	channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(msg)), {
		persistent: true,
	});
}

export { connectRabbitMq, sendRabbitMessage };
