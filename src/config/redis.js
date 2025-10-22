import { createClient } from "redis";
import { logger } from "./winston.js";

function connectToRedis(CONNECTION_STRING) {
	logger.info("Connecting to Redis");
	return new Promise((resolve, reject) => {
		const redisClient = createClient({
			url: CONNECTION_STRING || "redis://localhost:6379",
		});

		redisClient.on("error", (err) => reject(err));

		const connect = async () => {
			try {
				await redisClient.connect();
        logger.info('Connected to Redis')
        resolve(redisClient)
			} catch (error) {
				reject(error);
			}
		};

    connect()
	});
}

export { connectToRedis };
