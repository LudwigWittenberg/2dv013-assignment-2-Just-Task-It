import amqp from "amqplib/callback_api.js";
import { logger } from "./winston.js";

let channel;

async function connectRabbitMq(connectionString) {
	logger.info("Connecting to RabbitMQ");
	return new Promise((resolve, reject) => {
		amqp.connect(connectionString, function createChannel(error0, connection) {
			if (error0) {
				logger.error("RabbitMQ connection error: " + error0.message);
				reject(error0);
				return;
			}

			connection.on("error", (err) =>
				logger.error("RabbitMQ conn error: " + err.message),
			);

			connection.on("close", () => {
				logger.info("RabbitMQ conn closed");
				channel = undefined;
			});

			logger.info("RabbitMQ connected");

			connection.createChannel(function (error1, innerChannel) {
				if (error1) {
					logger.error("RabbitMQ channel creation error: " + error1.message);
					reject(error1);
					return;
				}

				channel = innerChannel;

				const QUEUE = process.env.RABBIT_QUEUE;

				channel.assertQueue(QUEUE, {
					durable: true,
					arguments: {
						"x-queue-type": "quorum",
					},
				});

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

	console.log("Sending message: ", msg);

	channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(msg)), {
		persistent: true,
	});
}

export { connectRabbitMq, sendRabbitMessage };
