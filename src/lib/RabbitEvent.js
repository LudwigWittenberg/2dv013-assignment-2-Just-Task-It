import { sendRabbitMessage } from "../config/rabbitMq.js";

function rabbitEvent(eventType, data) {
	const message = {
		event_type: eventType,
		task_id: data.id,
		timestamp: new Date().toISOString(),
		standard_value: Math.random()
	};

	sendRabbitMessage(message);
}

export { rabbitEvent };
